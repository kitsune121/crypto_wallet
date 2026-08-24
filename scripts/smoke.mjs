import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import { Wallet, hexlify } from 'ethers';

const mnemonic = bip39.generateMnemonic();
if (!bip39.validateMnemonic(mnemonic)) throw new Error('invalid mnemonic');

const seed = bip39.mnemonicToSeedSync(mnemonic);
const child = HDKey.fromMasterSeed(seed).derive("m/44'/60'/0'/0/0");
if (!child.privateKey) throw new Error('no private key');

const wallet = new Wallet(hexlify(child.privateKey));
if (!wallet.address.startsWith('0x')) throw new Error('bad address');

console.log('smoke ok', wallet.address);
