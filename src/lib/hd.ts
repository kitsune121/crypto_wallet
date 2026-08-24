import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import { Wallet, hexlify } from 'ethers';
import type { Account } from '../types/wallet';

const PATH_PREFIX = "m/44'/60'/0'/0";

export function generateMnemonic(strength = 128): string {
  return bip39.generateMnemonic(strength);
}

export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic.trim().toLowerCase());
}

export function mnemonicToSeed(mnemonic: string): Uint8Array {
  return bip39.mnemonicToSeedSync(mnemonic.trim().toLowerCase());
}

function derivePrivateKey(seed: Uint8Array, index: number): string {
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive(`${PATH_PREFIX}/${index}`);
  if (!child.privateKey) throw new Error('Failed to derive private key');
  return hexlify(child.privateKey);
}

export function createAccountFromMnemonic(
  mnemonic: string,
  index: number,
  name?: string,
): Account {
  const seed = mnemonicToSeed(mnemonic);
  const privateKey = derivePrivateKey(seed, index);
  const wallet = new Wallet(privateKey);
  return {
    index,
    name: name ?? `Account ${index + 1}`,
    address: wallet.address,
    path: `${PATH_PREFIX}/${index}`,
  };
}

export function getWalletAtIndex(mnemonic: string, index: number): Wallet {
  const seed = mnemonicToSeed(mnemonic);
  const privateKey = derivePrivateKey(seed, index);
  return new Wallet(privateKey);
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export { getAddress } from 'ethers';
