import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useWallet } from '../store/WalletContext';

export function CreatePasswordScreen() {
  const { setView, setPendingPassword, startImportWallet, pendingMnemonic } = useWallet();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => {
    if (password.length < 8) return 0;
    let s = 1;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 3);
  }, [password]);

  const onContinue = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('Please agree to the terms');
      return;
    }
    setPendingPassword(password);
  };

  return (
    <div className="screen">
      <PageHeader title="Create password" onBack={() => setView('welcome')} />
      <div className="screen-scroll">
        <p className="hint" style={{ marginBottom: 16 }}>
          This password will unlock your Cryptera wallet only on this device. Cryptera cannot recover this
          password.
        </p>
        <div className="field">
          <label>New password (min 8 characters)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: i < strength ? '#28a745' : '#eef0f2',
                }}
              />
            ))}
          </div>
        </div>
        <div className="field">
          <label>Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <label className="checkbox-row">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>
            I understand that Cryptera cannot recover this password for me.{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Learn more
            </a>
          </span>
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" onClick={onContinue} style={{ marginTop: 12 }}>
          {pendingMnemonic ? 'Create a new wallet' : 'Import my wallet'}
        </button>
        {!pendingMnemonic && (
          <button className="btn btn-ghost" onClick={startImportWallet}>
            Back to import
          </button>
        )}
      </div>
    </div>
  );
}
