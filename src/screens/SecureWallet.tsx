import { useState } from 'react';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { copyToClipboard } from '../lib/format';
import { useWallet } from '../store/WalletContext';

export function SecureWalletScreen() {
  const { pendingMnemonic, setView } = useWallet();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const words = (pendingMnemonic ?? '').trim().split(/\s+/).filter(Boolean);

  if (!pendingMnemonic || words.length < 12) {
    return (
      <div className="screen">
        <PageHeader title="Secure your wallet" onBack={() => setView('create-password')} />
        <div className="screen-scroll">
          <p className="error-text">No recovery phrase found. Start wallet creation again.</p>
          <button className="btn btn-primary" onClick={() => setView('welcome')}>
            Back to welcome
          </button>
        </div>
      </div>
    );
  }

  const onCopy = async () => {
    if (!pendingMnemonic) return;
    await copyToClipboard(pendingMnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="screen">
      <PageHeader title="Secure your wallet" onBack={() => setView('create-password')} />
      <div className="screen-scroll">
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Secure your wallet</h3>
        <p className="hint">
          Write down this 12-word Secret Recovery Phrase and store it in a safe place. Anyone with
          this phrase can take your funds.
        </p>
        <div className="warning-box">
          Never share your Secret Recovery Phrase with anyone. Cryptera Support will never ask for it.
        </div>

        <div
          style={{
            position: 'relative',
            border: '1px solid var(--nx-border)',
            borderRadius: 12,
            padding: 12,
            marginTop: 8,
          }}
        >
          {!revealed && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backdropFilter: 'blur(6px)',
                background: 'rgba(255,255,255,0.65)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setRevealed(true)}>
                <Eye size={16} /> Tap to reveal
              </button>
            </div>
          )}
          <div className="seed-grid">
            {words.map((w, i) => (
              <div className="seed-word" key={`${w}-${i}`}>
                <em>{i + 1}.</em>
                {revealed ? w : '••••'}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn btn-secondary" onClick={onCopy} disabled={!revealed}>
            <Copy size={16} /> {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setRevealed((v) => !v)}
            style={{ width: 'auto', padding: '0 14px' }}
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button
          className="btn btn-primary"
          style={{ marginTop: 20 }}
          disabled={!revealed}
          onClick={() => setView('confirm-seed')}
        >
          Next
        </button>
      </div>
    </div>
  );
}
