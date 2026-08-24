import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { formatBalance } from '../lib/format';
import { useWallet } from '../store/WalletContext';

export function ActivityScreen() {
  const { setView, vault, selectedNetwork } = useWallet();
  const activity = (vault?.transactions ?? []).filter((t) => t.chainId === selectedNetwork.chainId);

  return (
    <div className="screen has-bottom-nav">
      <PageHeader title="Activity" onBack={() => setView('home')} />
      <div className="screen-scroll">
        {activity.length === 0 && <div className="empty-state">You have no transactions yet</div>}
        {activity.map((tx) => (
          <button
            key={tx.hash}
            type="button"
            className="activity-row"
            onClick={() =>
              selectedNetwork.explorerUrl &&
              window.open(`${selectedNetwork.explorerUrl}/tx/${tx.hash}`, '_blank')
            }
          >
            <div
              className="token-icon"
              style={{
                background: tx.direction === 'sent' ? '#1a2438' : '#123528',
                color: '#f4f7ff',
              }}
            >
              {tx.direction === 'sent' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
            </div>
            <div className="token-meta">
              <strong>{tx.direction === 'sent' ? 'Sent' : 'Received'}</strong>
              <span>{new Date(tx.timestamp).toLocaleString()}</span>
            </div>
            <div className="token-amounts">
              <strong>
                {tx.direction === 'sent' ? '-' : '+'}
                {formatBalance(tx.value)} {tx.symbol}
              </strong>
              <span className={`status-pill ${tx.status}`}>{tx.status}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
