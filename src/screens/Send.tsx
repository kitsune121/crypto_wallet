import { useEffect, useState } from 'react';
import { isAddress } from 'ethers';
import { PageHeader } from '../components/PageHeader';
import { estimateGasPrice } from '../lib/rpc';
import { estimateUsd, formatBalance, formatFiat } from '../lib/format';
import { useWallet } from '../store/WalletContext';

type GasSpeed = 'slow' | 'market' | 'fast';

export function SendScreen() {
  const {
    setView,
    balance,
    selectedNetwork,
    selectedAccount,
    vault,
    tokenBalances,
    sendNative,
    sendToken,
  } = useWallet();
  const tokens = (vault?.tokens ?? []).filter((t) => t.chainId === selectedNetwork.chainId);
  const [asset, setAsset] = useState<'native' | string>('native');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [speed, setSpeed] = useState<GasSpeed>('market');
  const [gas, setGas] = useState({ slow: '—', market: '—', fast: '—' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    void estimateGasPrice(selectedNetwork).then(setGas);
  }, [selectedNetwork]);

  const selectedToken = tokens.find((t) => t.address === asset);
  const available =
    asset === 'native' ? balance : tokenBalances[asset.toLowerCase()] ?? '0';
  const symbol = asset === 'native' ? selectedNetwork.symbol : selectedToken?.symbol ?? '';

  const onMax = () => {
    if (asset !== 'native') {
      setAmount(available);
      return;
    }
    // Leave a small buffer so Max doesn't fail on gas
    const n = Number(available);
    const buffered = Math.max(0, n - 0.0005);
    setAmount(buffered > 0 ? buffered.toFixed(6).replace(/\.?0+$/, '') : '0');
  };

  const onSend = async () => {
    setError(null);
    if (!isAddress(to)) {
      setError('Invalid recipient address');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (Number(amount) > Number(available)) {
      setError('Insufficient balance');
      return;
    }
    if (asset !== 'native' && !selectedToken) {
      setError('Select a valid token');
      return;
    }
    setBusy(true);
    try {
      const hash =
        asset === 'native'
          ? await sendNative(to, amount)
          : await sendToken(selectedToken!, to, amount);
      setTxHash(hash);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Transaction failed';
      setError(msg.replace(/^error:\s*/i, '') || 'Transaction failed');
    } finally {
      setBusy(false);
    }
  };

  if (txHash) {
    return (
      <div className="screen">
        <PageHeader title="Transaction submitted" onBack={() => setView('home')} />
        <div className="screen-center">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#e8f7ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#28a745',
              fontSize: 28,
              marginBottom: 16,
            }}
          >
            ✓
          </div>
          <h3 style={{ marginBottom: 8 }}>Transaction submitted</h3>
          <p className="hint" style={{ marginBottom: 16 }}>
            Your {symbol} is on the way.
          </p>
          {selectedNetwork.explorerUrl && (
            <button
              className="btn btn-secondary"
              onClick={() => window.open(`${selectedNetwork.explorerUrl}/tx/${txHash}`, '_blank')}
            >
              View on block explorer
            </button>
          )}
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setView('home')}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <PageHeader title="Send" onBack={() => setView('home')} />
      <div className="screen-scroll">
        <div className="field">
          <label>From</label>
          <input value={`${selectedAccount?.name} (${selectedNetwork.shortName})`} disabled />
        </div>
        <div className="field">
          <label>Asset</label>
          <select value={asset} onChange={(e) => setAsset(e.target.value)}>
            <option value="native">
              {selectedNetwork.symbol} — {formatBalance(balance)}
            </option>
            {tokens.map((t) => (
              <option key={t.address} value={t.address}>
                {t.symbol} — {formatBalance(tokenBalances[t.address.toLowerCase()] ?? '0')}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>To</label>
          <input
            placeholder="Recipient address (0x...)"
            value={to}
            onChange={(e) => setTo(e.target.value.trim())}
          />
        </div>
        <div className="field">
          <label>Amount</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={onMax}>
              Max
            </button>
          </div>
          <span className="hint">
            ≈ {formatFiat(estimateUsd(amount || '0', symbol))} · Available {formatBalance(available)}{' '}
            {symbol}
          </span>
        </div>

        <div className="field">
          <label>Gas option</label>
          <div className="chip-row">
            {(['slow', 'market', 'fast'] as GasSpeed[]).map((s) => (
              <button
                key={s}
                className={`chip ${speed === s ? 'selected' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s} · {gas[s]} Gwei
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" disabled={busy} onClick={onSend}>
          {busy ? 'Sending...' : 'Next'}
        </button>
      </div>
    </div>
  );
}
