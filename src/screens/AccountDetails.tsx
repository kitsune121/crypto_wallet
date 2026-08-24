import { useState } from 'react';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Identicon } from '../components/Logo';
import { copyToClipboard } from '../lib/format';
import { getWalletAtIndex, shortenAddress } from '../lib/hd';
import { useWallet } from '../store/WalletContext';

export function AccountDetailsScreen() {
  const { setView, selectedAccount, selectedNetwork, vault, password, renameAccount } = useWallet();
  const [name, setName] = useState(selectedAccount?.name ?? '');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState<'addr' | 'key' | null>(null);
  const [pw, setPw] = useState('');
  const [unlockedKey, setUnlockedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!selectedAccount || !vault) return null;

  const privateKey =
    unlockedKey ??
    (showKey && password ? getWalletAtIndex(vault.mnemonic, selectedAccount.index).privateKey : null);

  const onCopy = async (text: string, kind: 'addr' | 'key') => {
    await copyToClipboard(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1200);
  };

  const revealKey = () => {
    if (pw !== password) {
      setError('Incorrect password');
      return;
    }
    setError(null);
    const wallet = getWalletAtIndex(vault.mnemonic, selectedAccount.index);
    setUnlockedKey(wallet.privateKey);
    setShowKey(true);
  };

  return (
    <div className="screen">
      <PageHeader title="Account details" onBack={() => setView('home')} />
      <div className="screen-scroll" style={{ textAlign: 'center' }}>
        <Identicon address={selectedAccount.address} size={56} />
        <div className="field" style={{ marginTop: 16 }}>
          <label>Account name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              if (name.trim() && name !== selectedAccount.name) {
                void renameAccount(selectedAccount.index, name.trim());
              }
            }}
          />
        </div>
        <div className="field">
          <label>Public address</label>
          <button
            className="copy-pill"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => void onCopy(selectedAccount.address, 'addr')}
          >
            <Copy size={14} />
            {copied === 'addr' ? 'Copied!' : shortenAddress(selectedAccount.address, 8)}
          </button>
        </div>

        {selectedNetwork.explorerUrl && (
          <button
            className="btn btn-secondary"
            style={{ marginBottom: 16 }}
            onClick={() =>
              window.open(
                `${selectedNetwork.explorerUrl}/address/${selectedAccount.address}`,
                '_blank',
              )
            }
          >
            View on explorer
          </button>
        )}

        <div className="warning-box">
          Warning: Never disclose this key. Anyone with your private keys can steal any assets held
          in your account.
        </div>

        {!showKey ? (
          <>
            <div className="field">
              <label>Enter password to reveal private key</label>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" onClick={revealKey}>
              <Eye size={16} /> Show private key
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                wordBreak: 'break-all',
                background: 'var(--nx-bg-alt)',
                borderRadius: 8,
                padding: 12,
                fontSize: 12,
                textAlign: 'left',
                marginBottom: 12,
              }}
            >
              {privateKey}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-secondary"
                onClick={() => privateKey && void onCopy(privateKey, 'key')}
              >
                <Copy size={16} /> {copied === 'key' ? 'Copied!' : 'Copy'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowKey(false);
                  setUnlockedKey(null);
                  setPw('');
                }}
              >
                <EyeOff size={16} /> Hide
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
