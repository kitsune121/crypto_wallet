import type { StoredVault, VaultData } from '../types/wallet';
import { decryptVault, encryptVault } from './crypto';
import { DEFAULT_NETWORK } from './networks';

const VAULT_KEY = 'nexus_vault';
const LOCK_KEY = 'nexus_locked';

export function hasVault(): boolean {
  return Boolean(localStorage.getItem(VAULT_KEY));
}

export function getStoredVault(): StoredVault | null {
  const raw = localStorage.getItem(VAULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredVault;
  } catch {
    return null;
  }
}

export async function saveVault(vault: VaultData, password: string): Promise<void> {
  const payload = JSON.stringify(vault);
  const { encrypted, salt, iv } = await encryptVault(payload, password);
  const stored: StoredVault = { encrypted, salt, iv, version: 1 };
  localStorage.setItem(VAULT_KEY, JSON.stringify(stored));
}

export async function loadVault(password: string): Promise<VaultData> {
  const stored = getStoredVault();
  if (!stored) throw new Error('No vault found');
  const json = await decryptVault(stored.encrypted, password, stored.salt, stored.iv);
  return JSON.parse(json) as VaultData;
}

export function createEmptyVault(mnemonic: string): VaultData {
  return {
    mnemonic,
    accounts: [],
    selectedAccountIndex: 0,
    selectedNetworkId: DEFAULT_NETWORK,
    tokens: [],
    transactions: [],
    contacts: [],
    showTestNetworks: false,
    currency: 'USD',
    autoLockMinutes: 5,
  };
}

export function clearVault(): void {
  localStorage.removeItem(VAULT_KEY);
  localStorage.removeItem(LOCK_KEY);
}

export function setSessionUnlocked(unlocked: boolean): void {
  if (unlocked) sessionStorage.setItem('nexus_session', '1');
  else sessionStorage.removeItem('nexus_session');
}

export function isSessionUnlocked(): boolean {
  return sessionStorage.getItem('nexus_session') === '1';
}
