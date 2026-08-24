import { Check } from 'lucide-react';
import { NETWORKS } from '../lib/networks';
import type { NetworkId } from '../types/wallet';
import { useWallet } from '../store/WalletContext';

export function NetworkMenu({ onClose }: { onClose: () => void }) {
  const { vault, selectedNetwork, selectNetwork, setView, setShowTestNetworks } = useWallet();
  const showTest = vault?.showTestNetworks ?? false;

  const list = (Object.keys(NETWORKS) as NetworkId[]).filter((id) => {
    const n = NETWORKS[id];
    if (n.isTestnet && !showTest && n.id !== selectedNetwork.id) return false;
    return true;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Select a network</div>
        {list.map((id) => {
          const n = NETWORKS[id];
          return (
            <button
              key={id}
              className={`list-item ${selectedNetwork.id === id ? 'active' : ''}`}
              onClick={async () => {
                await selectNetwork(id);
                onClose();
              }}
            >
              <span className="network-dot" style={{ background: n.color, width: 14, height: 14 }} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <strong style={{ fontSize: 14 }}>{n.name}</strong>
              </div>
              {selectedNetwork.id === id && <Check size={18} color="#F6851B" />}
            </button>
          );
        })}
        <div
          className="list-item"
          style={{ marginTop: 8, borderTop: '1px solid var(--nx-border-light)', paddingTop: 16 }}
        >
          <span style={{ flex: 1, fontSize: 14 }}>Show test networks</span>
          <button
            className={`toggle ${showTest ? 'on' : ''}`}
            onClick={() => void setShowTestNetworks(!showTest)}
            aria-label="Show test networks"
          />
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => {
            onClose();
            setView('networks');
          }}
        >
          Add network
        </button>
      </div>
    </div>
  );
}
