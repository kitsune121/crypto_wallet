import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Contract, getAddress } from 'ethers';
import type {
  Account,
  AppView,
  NetworkId,
  Token,
  TxRecord,
  VaultData,
} from '../types/wallet';
import { createAccountFromMnemonic, generateMnemonic, getWalletAtIndex, validateMnemonic } from '../lib/hd';
import { NETWORKS } from '../lib/networks';
import {
  clearVault,
  createEmptyVault,
  hasVault,
  isSessionUnlocked,
  loadVault,
  saveVault,
  setSessionUnlocked,
} from '../lib/storage';
import {
  ERC20_ABI,
  fetchNativeBalance,
  fetchTokenBalance,
  fetchTokenMeta,
  getProvider,
  parseEther,
  parseUnits,
} from '../lib/rpc';

interface WalletContextValue {
  view: AppView;
  setView: (v: AppView) => void;
  hasExistingVault: boolean;
  unlocked: boolean;
  vault: VaultData | null;
  password: string | null;
  pendingMnemonic: string | null;
  balance: string;
  tokenBalances: Record<string, string>;
  loadingBalance: boolean;
  error: string | null;
  setError: (e: string | null) => void;
  selectedAccount: Account | null;
  selectedNetwork: (typeof NETWORKS)[NetworkId];
  startCreateWallet: () => void;
  startImportWallet: () => void;
  setPendingPassword: (pw: string) => void;
  confirmSeedAndCreate: () => Promise<void>;
  importWithMnemonic: (mnemonic: string, password: string) => Promise<void>;
  unlock: (password: string) => Promise<void>;
  lock: () => void;
  resetWallet: () => void;
  createAccount: (name?: string) => Promise<void>;
  selectAccount: (index: number) => Promise<void>;
  renameAccount: (index: number, name: string) => Promise<void>;
  selectNetwork: (id: NetworkId) => Promise<void>;
  refreshBalances: () => Promise<void>;
  sendNative: (to: string, amount: string) => Promise<string>;
  sendToken: (token: Token, to: string, amount: string) => Promise<string>;
  addToken: (address: string) => Promise<Token>;
  removeToken: (address: string) => Promise<void>;
  setShowTestNetworks: (show: boolean) => Promise<void>;
  updateSettings: (partial: Partial<Pick<VaultData, 'currency' | 'autoLockMinutes'>>) => Promise<void>;
  revealSeed: (password: string) => Promise<string>;
  persist: (next: VaultData) => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

function markTxStatus(
  data: VaultData,
  hash: string,
  status: TxRecord['status'],
): VaultData {
  return {
    ...data,
    transactions: data.transactions.map((t) => (t.hash === hash ? { ...t, status } : t)),
  };
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppView>(() => (hasVault() ? 'unlock' : 'welcome'));
  const [hasExistingVault] = useState(() => hasVault());
  const [unlocked, setUnlocked] = useState(false);
  const [vault, setVault] = useState<VaultData | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [pendingMnemonic, setPendingMnemonic] = useState<string | null>(null);
  const [pendingPassword, setPendingPasswordState] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoLockTimer = useRef<number | null>(null);
  const vaultRef = useRef<VaultData | null>(null);
  const passwordRef = useRef<string | null>(null);

  vaultRef.current = vault;
  passwordRef.current = password;

  const selectedAccount = useMemo(() => {
    if (!vault) return null;
    return vault.accounts.find((a) => a.index === vault.selectedAccountIndex) ?? vault.accounts[0] ?? null;
  }, [vault]);

  const selectedNetwork = NETWORKS[vault?.selectedNetworkId ?? 'ethereum'];
  const selectedAddress = selectedAccount?.address ?? null;
  const tokenKey = useMemo(
    () =>
      (vault?.tokens ?? [])
        .filter((t) => t.chainId === selectedNetwork.chainId)
        .map((t) => t.address.toLowerCase())
        .join('|'),
    [vault?.tokens, selectedNetwork.chainId],
  );

  const persist = useCallback(async (next: VaultData) => {
    const pw = passwordRef.current;
    if (!pw) throw new Error('Wallet locked');
    await saveVault(next, pw);
    vaultRef.current = next;
    setVault(next);
  }, []);

  const refreshBalances = useCallback(async () => {
    const current = vaultRef.current;
    if (!current || !selectedAddress) return;
    const network = NETWORKS[current.selectedNetworkId];
    setLoadingBalance(true);
    try {
      const native = await fetchNativeBalance(network, selectedAddress);
      setBalance(native);
      const tokensOnChain = current.tokens.filter((t) => t.chainId === network.chainId);
      const entries = await Promise.all(
        tokensOnChain.map(async (t) => {
          const bal = await fetchTokenBalance(network, t, selectedAddress);
          return [t.address.toLowerCase(), bal] as const;
        }),
      );
      setTokenBalances(Object.fromEntries(entries));
    } finally {
      setLoadingBalance(false);
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (unlocked && selectedAddress) void refreshBalances();
  }, [unlocked, selectedAddress, selectedNetwork.id, tokenKey, refreshBalances]);

  const resetAutoLock = useCallback(() => {
    if (autoLockTimer.current) window.clearTimeout(autoLockTimer.current);
    const minutes = vaultRef.current?.autoLockMinutes ?? 5;
    if (!unlocked || minutes <= 0) return;
    autoLockTimer.current = window.setTimeout(() => {
      setUnlocked(false);
      setPassword(null);
      setVault(null);
      vaultRef.current = null;
      passwordRef.current = null;
      setSessionUnlocked(false);
      setView('unlock');
    }, minutes * 60 * 1000);
  }, [unlocked]);

  useEffect(() => {
    resetAutoLock();
    const events = ['click', 'keydown', 'mousemove'] as const;
    const onActivity = () => resetAutoLock();
    events.forEach((e) => window.addEventListener(e, onActivity));
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      if (autoLockTimer.current) window.clearTimeout(autoLockTimer.current);
    };
  }, [resetAutoLock]);

  const startCreateWallet = () => {
    setError(null);
    setPendingMnemonic(generateMnemonic());
    setView('create-password');
  };

  const startImportWallet = () => {
    setError(null);
    setPendingMnemonic(null);
    setView('import-wallet');
  };

  const setPendingPassword = (pw: string) => {
    setPendingPasswordState(pw);
    setView('secure-wallet');
  };

  const confirmSeedAndCreate = async () => {
    if (!pendingMnemonic || !pendingPassword) throw new Error('Missing setup data');
    const account = createAccountFromMnemonic(pendingMnemonic, 0);
    const next = createEmptyVault(pendingMnemonic);
    next.accounts = [account];
    await saveVault(next, pendingPassword);
    passwordRef.current = pendingPassword;
    vaultRef.current = next;
    setPassword(pendingPassword);
    setVault(next);
    setUnlocked(true);
    setSessionUnlocked(true);
    setPendingMnemonic(null);
    setPendingPasswordState(null);
    setView('home');
  };

  const importWithMnemonic = async (mnemonic: string, pw: string) => {
    const cleaned = mnemonic.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!validateMnemonic(cleaned)) throw new Error('Invalid Secret Recovery Phrase');
    const account = createAccountFromMnemonic(cleaned, 0);
    const next = createEmptyVault(cleaned);
    next.accounts = [account];
    await saveVault(next, pw);
    passwordRef.current = pw;
    vaultRef.current = next;
    setPassword(pw);
    setVault(next);
    setUnlocked(true);
    setSessionUnlocked(true);
    setView('home');
  };

  const unlock = async (pw: string) => {
    const data = await loadVault(pw);
    if (!data.accounts?.length) throw new Error('Vault is corrupted');
    passwordRef.current = pw;
    vaultRef.current = data;
    setPassword(pw);
    setVault(data);
    setUnlocked(true);
    setSessionUnlocked(true);
    setView('home');
  };

  const lock = () => {
    setUnlocked(false);
    setPassword(null);
    setVault(null);
    vaultRef.current = null;
    passwordRef.current = null;
    setSessionUnlocked(false);
    setView('unlock');
  };

  const resetWallet = () => {
    clearVault();
    setUnlocked(false);
    setPassword(null);
    setVault(null);
    vaultRef.current = null;
    passwordRef.current = null;
    setView('welcome');
    window.location.reload();
  };

  const createAccount = async (name?: string) => {
    const current = vaultRef.current;
    if (!current) return;
    const nextIndex = Math.max(...current.accounts.map((a) => a.index), -1) + 1;
    const account = createAccountFromMnemonic(current.mnemonic, nextIndex, name);
    await persist({
      ...current,
      accounts: [...current.accounts, account],
      selectedAccountIndex: nextIndex,
    });
  };

  const selectAccount = async (index: number) => {
    const current = vaultRef.current;
    if (!current) return;
    await persist({ ...current, selectedAccountIndex: index });
  };

  const renameAccount = async (index: number, name: string) => {
    const current = vaultRef.current;
    if (!current) return;
    await persist({
      ...current,
      accounts: current.accounts.map((a) => (a.index === index ? { ...a, name } : a)),
    });
  };

  const selectNetwork = async (id: NetworkId) => {
    const current = vaultRef.current;
    if (!current) return;
    await persist({ ...current, selectedNetworkId: id });
  };

  const pushTx = async (tx: TxRecord) => {
    const current = vaultRef.current;
    if (!current) return;
    await persist({ ...current, transactions: [tx, ...current.transactions].slice(0, 100) });
  };

  const watchTx = async (hash: string, waitPromise: Promise<unknown>) => {
    const pw = passwordRef.current;
    if (!pw) return;
    try {
      await waitPromise;
      const current = await loadVault(pw);
      const updated = markTxStatus(current, hash, 'confirmed');
      await saveVault(updated, pw);
      vaultRef.current = updated;
      setVault(updated);
      void refreshBalances();
    } catch {
      const current = await loadVault(pw);
      const updated = markTxStatus(current, hash, 'failed');
      await saveVault(updated, pw);
      vaultRef.current = updated;
      setVault(updated);
    }
  };

  const sendNative = async (to: string, amount: string) => {
    const current = vaultRef.current;
    if (!current || !selectedAccount) throw new Error('Wallet not ready');
    const network = NETWORKS[current.selectedNetworkId];
    const wallet = getWalletAtIndex(current.mnemonic, selectedAccount.index).connect(
      getProvider(network),
    );
    const tx = await wallet.sendTransaction({ to: getAddress(to), value: parseEther(amount) });
    const record: TxRecord = {
      hash: tx.hash,
      from: selectedAccount.address,
      to: getAddress(to),
      value: amount,
      symbol: network.symbol,
      chainId: network.chainId,
      timestamp: Date.now(),
      status: 'pending',
      direction: 'sent',
    };
    await pushTx(record);
    void watchTx(tx.hash, tx.wait());
    return tx.hash;
  };

  const sendToken = async (token: Token, to: string, amount: string) => {
    const current = vaultRef.current;
    if (!current || !selectedAccount) throw new Error('Wallet not ready');
    const network = NETWORKS[current.selectedNetworkId];
    const wallet = getWalletAtIndex(current.mnemonic, selectedAccount.index).connect(
      getProvider(network),
    );
    const contract = new Contract(token.address, ERC20_ABI, wallet);
    const tx = await contract.transfer(getAddress(to), parseUnits(amount, token.decimals));
    const record: TxRecord = {
      hash: tx.hash as string,
      from: selectedAccount.address,
      to: getAddress(to),
      value: amount,
      symbol: token.symbol,
      chainId: network.chainId,
      timestamp: Date.now(),
      status: 'pending',
      direction: 'sent',
    };
    await pushTx(record);
    void watchTx(tx.hash as string, tx.wait());
    return tx.hash as string;
  };

  const addToken = async (address: string) => {
    const current = vaultRef.current;
    if (!current) throw new Error('Wallet not ready');
    const network = NETWORKS[current.selectedNetworkId];
    const checksummed = getAddress(address);
    const meta = await fetchTokenMeta(network, checksummed);
    const token: Token = {
      address: checksummed,
      chainId: network.chainId,
      ...meta,
    };
    const exists = current.tokens.some(
      (t) => t.address.toLowerCase() === checksummed.toLowerCase() && t.chainId === token.chainId,
    );
    if (exists) throw new Error('Token already added');
    await persist({ ...current, tokens: [...current.tokens, token] });
    return token;
  };

  const removeToken = async (address: string) => {
    const current = vaultRef.current;
    if (!current) return;
    const network = NETWORKS[current.selectedNetworkId];
    await persist({
      ...current,
      tokens: current.tokens.filter(
        (t) =>
          !(t.address.toLowerCase() === address.toLowerCase() && t.chainId === network.chainId),
      ),
    });
  };

  const setShowTestNetworks = async (show: boolean) => {
    const current = vaultRef.current;
    if (!current) return;
    await persist({ ...current, showTestNetworks: show });
  };

  const updateSettings = async (
    partial: Partial<Pick<VaultData, 'currency' | 'autoLockMinutes'>>,
  ) => {
    const current = vaultRef.current;
    if (!current) return;
    await persist({ ...current, ...partial });
  };

  const revealSeed = async (pw: string) => {
    const data = await loadVault(pw);
    return data.mnemonic;
  };

  useEffect(() => {
    if (!hasVault() && isSessionUnlocked()) setSessionUnlocked(false);
  }, []);

  const value: WalletContextValue = {
    view,
    setView,
    hasExistingVault,
    unlocked,
    vault,
    password,
    pendingMnemonic,
    balance,
    tokenBalances,
    loadingBalance,
    error,
    setError,
    selectedAccount,
    selectedNetwork,
    startCreateWallet,
    startImportWallet,
    setPendingPassword,
    confirmSeedAndCreate,
    importWithMnemonic,
    unlock,
    lock,
    resetWallet,
    createAccount,
    selectAccount,
    renameAccount,
    selectNetwork,
    refreshBalances,
    sendNative,
    sendToken,
    addToken,
    removeToken,
    setShowTestNetworks,
    updateSettings,
    revealSeed,
    persist,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
