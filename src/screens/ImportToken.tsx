import { useState } from 'react';
import { isAddress } from 'ethers';
import { PageHeader } from '../components/PageHeader';
import { useWallet } from '../store/WalletContext';

export function ImportTokenScreen() {
  const { setView, addToken, selectedNetwork } = useWallet();
  const [address, setAddress] = useState('');
  const [preview, setPreview] = useState<{ name: string; symbol: string; decimals: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onNext = async () => {
    setError(null);
    if (!isAddress(address)) {
      setError('Invalid token contract address');
      return;
    }
    setBusy(true);
    try {
      const token = await addToken(address);
      setPreview(token);
      setView('home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not import token');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <PageHeader title="Import tokens" onBack={() => setView('home')} />
      <div className="screen-scroll">
        <p className="hint" style={{ marginBottom: 12 }}>
          Custom tokens on {selectedNetwork.shortName}. Anyone can create a token — including fake
          versions of existing tokens.
        </p>
        <div className="field">
          <label>Token contract address</label>
          <input
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
          />
        </div>
        {preview && (
          <div className="warning-box">
            {preview.name} ({preview.symbol}) · {preview.decimals} decimals
          </div>
        )}
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" disabled={busy || !address} onClick={onNext}>
          {busy ? 'Importing...' : 'Add custom token'}
        </button>
      </div>
    </div>
  );
}
