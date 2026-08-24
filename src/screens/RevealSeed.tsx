import { useState } from 'react';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { copyToClipboard } from '../lib/format';
import { useWallet } from '../store/WalletContext';

export function RevealSeedScreen() {
  const { setView, revealSeed } = useWallet();
  const [password, setPassword] = useState('');
  const [phrase, setPhrase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hold, setHold] = useState(false);

  const onReveal = async () => {
    setError(null);
    try {
      const m = await revealSeed(password);
      setPhrase(m);
    } catch {
      setError('Incorrect password');
    }
  };

  return (
    <div className="screen">
      <PageHeader title="Secret Recovery Phrase" onBack={() => setView('settings')} />
      <div className="screen-scroll">
        <div className="warning-box">
          DO NOT share this phrase with anyone! These words can be used to steal all your accounts.
        </div>
        {!phrase ? (
          <>
            <div className="field">
              <label>Enter password to continue</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" onClick={onReveal}>
              Next
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                position: 'relative',
                border: '1px solid var(--nx-border)',
                borderRadius: 12,
                padding: 12,
              }}
            >
              {!hold && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backdropFilter: 'blur(5px)',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="hint">Hold to reveal Secret Recovery Phrase</span>
                </div>
              )}
              <div className="seed-grid">
                {phrase.split(' ').map((w, i) => (
                  <div className="seed-word" key={`${w}-${i}`}>
                    <em>{i + 1}.</em>
                    {hold ? w : '••••'}
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn btn-secondary"
              style={{ marginTop: 12 }}
              onMouseDown={() => setHold(true)}
              onMouseUp={() => setHold(false)}
              onMouseLeave={() => setHold(false)}
              onTouchStart={() => setHold(true)}
              onTouchEnd={() => setHold(false)}
            >
              {hold ? <Eye size={16} /> : <EyeOff size={16} />} Hold to reveal
            </button>
            <button
              className="btn btn-primary"
              style={{ marginTop: 12 }}
              onClick={async () => {
                await copyToClipboard(phrase);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
            >
              <Copy size={16} /> {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
