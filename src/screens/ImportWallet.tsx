import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { validateMnemonic } from '../lib/hd';
import { useWallet } from '../store/WalletContext';

const VALID_LENGTHS = new Set([12, 15, 18, 21, 24]);

export function ImportWalletScreen() {
  const { setView, importWithMnemonic } = useWallet();
  const [step, setStep] = useState<'phrase' | 'password'>('phrase');
  const [phrase, setPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const wordCount = phrase.trim() ? phrase.trim().split(/\s+/).length : 0;

  const onContinuePhrase = () => {
    const cleaned = phrase.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!VALID_LENGTHS.has(cleaned.split(' ').length)) {
      setError('Secret Recovery Phrase must be 12, 15, 18, 21, or 24 words');
      return;
    }
    if (!validateMnemonic(cleaned)) {
      setError('Invalid Secret Recovery Phrase');
      return;
    }
    setError(null);
    setStep('password');
  };

  const onImport = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await importWithMnemonic(phrase, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <PageHeader
        title="Import a wallet"
        onBack={() => (step === 'password' ? setStep('phrase') : setView('welcome'))}
      />
      <div className="screen-scroll">
        {step === 'phrase' ? (
          <>
            <p className="hint" style={{ marginBottom: 12 }}>
              Enter your Secret Recovery Phrase. Cryptera uses this phrase to restore your accounts.
            </p>
            <div className="field">
              <label>Secret Recovery Phrase</label>
              <textarea
                placeholder="Paste or type your 12-word phrase separated by spaces"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button
              className="btn btn-primary"
              disabled={wordCount < 12}
              onClick={onContinuePhrase}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <p className="hint" style={{ marginBottom: 12 }}>
              Create a password to unlock Cryptera on this device.
            </p>
            <div className="field">
              <label>New password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" disabled={busy} onClick={onImport}>
              {busy ? 'Importing...' : 'Import'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
