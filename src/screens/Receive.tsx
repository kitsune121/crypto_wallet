import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { copyToClipboard } from '../lib/format';
import { useWallet } from '../store/WalletContext';

export function ReceiveScreen() {
  const { setView, selectedAccount, selectedNetwork } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!selectedAccount) return null;

  const onCopy = async () => {
    await copyToClipboard(selectedAccount.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="screen">
      <PageHeader title="Receive" onBack={() => setView('home')} />
      <div className="screen-center">
        <p className="hint" style={{ marginBottom: 8 }}>
          Scan address to receive {selectedNetwork.symbol} on {selectedNetwork.shortName}
        </p>
        <div className="qr-wrap">
          <QRCodeSVG value={selectedAccount.address} size={180} level="M" />
        </div>
        <strong style={{ marginTop: 8 }}>{selectedAccount.name}</strong>
        <button className="copy-pill" style={{ marginTop: 12, maxWidth: '100%' }} onClick={onCopy}>
          <Copy size={14} />
          {copied ? 'Copied!' : selectedAccount.address}
        </button>
        <p className="hint" style={{ marginTop: 16 }}>
          Only send {selectedNetwork.symbol} and tokens on {selectedNetwork.name} to this address.
        </p>
      </div>
    </div>
  );
}
