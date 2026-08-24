import { Check, Plus } from 'lucide-react';
import { Identicon } from '../components/Logo';
import { shortenAddress } from '../lib/hd';
import { useWallet } from '../store/WalletContext';

export function AccountMenu({ onClose }: { onClose: () => void }) {
  const { vault, selectedAccount, selectAccount, createAccount, setView } = useWallet();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Select an account</div>
        {(vault?.accounts ?? []).map((account) => (
          <button
            key={account.address}
            className={`list-item ${selectedAccount?.address === account.address ? 'active' : ''}`}
            onClick={async () => {
              await selectAccount(account.index);
              onClose();
            }}
          >
            <Identicon address={account.address} size={32} />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <strong style={{ display: 'block', fontSize: 14 }}>{account.name}</strong>
              <span style={{ fontSize: 12, color: 'var(--nx-text-muted)' }}>
                {shortenAddress(account.address)}
              </span>
            </div>
            {selectedAccount?.address === account.address && <Check size={18} color="#F6851B" />}
          </button>
        ))}
        <button
          className="list-item"
          onClick={async () => {
            await createAccount();
            onClose();
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--nx-bg-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={16} />
          </div>
          <strong>Add account</strong>
        </button>
        <button
          className="list-item"
          onClick={() => {
            onClose();
            setView('account-details');
          }}
        >
          Account details
        </button>
      </div>
    </div>
  );
}
