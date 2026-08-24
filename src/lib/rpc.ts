import { Contract, formatEther, formatUnits, JsonRpcProvider, parseEther, parseUnits } from 'ethers';
import type { NetworkConfig, Token } from '../types/wallet';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

export function getProvider(network: NetworkConfig): JsonRpcProvider {
  return new JsonRpcProvider(network.rpcUrl, network.chainId);
}

export async function fetchNativeBalance(
  network: NetworkConfig,
  address: string,
): Promise<string> {
  try {
    const provider = getProvider(network);
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch {
    return '0';
  }
}

export async function fetchTokenBalance(
  network: NetworkConfig,
  token: Token,
  address: string,
): Promise<string> {
  try {
    const provider = getProvider(network);
    const contract = new Contract(token.address, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    return formatUnits(balance, token.decimals);
  } catch {
    return '0';
  }
}

export async function fetchTokenMeta(
  network: NetworkConfig,
  tokenAddress: string,
): Promise<Pick<Token, 'name' | 'symbol' | 'decimals'>> {
  const provider = getProvider(network);
  const contract = new Contract(tokenAddress, ERC20_ABI, provider);
  const [name, symbol, decimals] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
  ]);
  return { name, symbol, decimals: Number(decimals) };
}

export async function estimateGasPrice(network: NetworkConfig): Promise<{
  slow: string;
  market: string;
  fast: string;
}> {
  try {
    const provider = getProvider(network);
    const fee = await provider.getFeeData();
    const gasPrice = fee.gasPrice ?? 0n;
    const gwei = (v: bigint) => formatUnits(v, 'gwei');
    return {
      slow: gwei((gasPrice * 80n) / 100n),
      market: gwei(gasPrice),
      fast: gwei((gasPrice * 120n) / 100n),
    };
  } catch {
    return { slow: '1', market: '1.5', fast: '2' };
  }
}

export { parseEther, parseUnits, formatEther, formatUnits, ERC20_ABI };
