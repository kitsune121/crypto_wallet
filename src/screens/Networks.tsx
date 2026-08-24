import { PageHeader } from '../components/PageHeader';
import { NETWORKS } from '../lib/networks';
import type { NetworkId } from '../types/wallet';
import { useWallet } from '../store/WalletContext';

export function NetworksScreen() {
  const { setView, selectNetwork, selectedNetwork } = useWallet();

  return (
    <div className="screen">
      <PageHeader title="Networks" onBack={() => setView('settings')} />
      <div className="screen-scroll">
        <p className="hint" style={{ marginBottom: 12 }}>
          Cryptera supports popular EVM networks. Select one to use as your active network.
        </p>
        {(Object.keys(NETWORKS) as NetworkId[]).map((id) => {
          const n = NETWORKS[id];
          return (
            <button
              key={id}
              className={`list-item ${selectedNetwork.id === id ? 'active' : ''}`}
              onClick={async () => {
                await selectNetwork(id);
                setView('home');
              }}
            >
              <span className="network-dot" style={{ background: n.color, width: 14, height: 14 }} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <strong style={{ display: 'block', fontSize: 14 }}>{n.name}</strong>
                <span style={{ fontSize: 12, color: 'var(--nx-text-muted)' }}>
                  Chain ID {n.chainId} · {n.symbol}
                  {n.isTestnet ? ' · Testnet' : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
