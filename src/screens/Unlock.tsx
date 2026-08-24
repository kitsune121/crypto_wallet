import { useState } from 'react';
import { CrypteraLogo } from '../components/Logo';
import { useWallet } from '../store/WalletContext';

export function UnlockScreen() {
  const { unlock, resetWallet } = useWallet();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const onUnlock = async () => {
    setBusy(true);
    setError(null);
    try {
      await unlock(password);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('corrupted')) {
        setError('Wallet data is corrupted. Reset and restore with your Secret Recovery Phrase.');
      } else {
        setError('Incorrect password');
      }
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <div className="screen-center">
        <CrypteraLogo size={96} />
        <h1 className="brand-title" style={{ fontSize: 22 }}>
          Welcome back!
        </h1>
        <p className="brand-sub" style={{ marginBottom: 20 }}>
          The decentralized web awaits
        </p>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void onUnlock()}
            autoFocus
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" disabled={busy || !password} onClick={onUnlock}>
          {busy ? 'Unlocking...' : 'Unlock'}
        </button>
        <button className="btn btn-ghost" onClick={() => setShowReset(true)}>
          Forgot password?
        </button>
      </div>

      {showReset && (
        <div className="modal-backdrop">
          <div className="modal-center">
            <h3 className="sheet-title">Reset wallet?</h3>
            <p className="hint" style={{ marginBottom: 16 }}>
              Cryptera cannot recover your password. You can reset this wallet and restore with your
              Secret Recovery Phrase. Make sure you have it before continuing.
            </p>
            <button className="btn btn-danger" onClick={resetWallet}>
              Reset wallet
            </button>
            <button className="btn btn-ghost" onClick={() => setShowReset(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
