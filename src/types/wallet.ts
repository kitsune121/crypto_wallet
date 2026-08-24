export type NetworkId =
  | 'ethereum'
  | 'sepolia'
  | 'polygon'
  | 'arbitrum'
  | 'optimism'
  | 'base'
  | 'bsc'
  | 'localhost';

export interface NetworkConfig {
  id: NetworkId;
  name: string;
  shortName: string;
  chainId: number;
  rpcUrl: string;
  symbol: string;
  decimals: number;
  explorerUrl: string;
  color: string;
  isTestnet?: boolean;
}

export interface Account {
  index: number;
  name: string;
  address: string;
  path: string;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  balance?: string;
  logo?: string;
}

export interface TxRecord {
  hash: string;
  from: string;
  to: string;
  value: string;
  symbol: string;
  chainId: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  direction: 'sent' | 'received';
}

export interface VaultData {
  mnemonic: string;
  accounts: Account[];
  selectedAccountIndex: number;
  selectedNetworkId: NetworkId;
  tokens: Token[];
  transactions: TxRecord[];
  contacts: { name: string; address: string }[];
  showTestNetworks: boolean;
  currency: string;
  autoLockMinutes: number;
}

export interface StoredVault {
  encrypted: string;
  salt: string;
  iv: string;
  version: number;
}

export type AppView =
  | 'welcome'
  | 'create-password'
  | 'secure-wallet'
  | 'confirm-seed'
  | 'import-wallet'
  | 'unlock'
  | 'home'
  | 'send'
  | 'receive'
  | 'swap'
  | 'bridge'
  | 'settings'
  | 'networks'
  | 'accounts'
  | 'import-token'
  | 'account-details'
  | 'reveal-seed'
  | 'connected-sites'
  | 'about'
  | 'buy'
  | 'help'
  | 'activity'
  | 'contacts'
  | 'tips';
