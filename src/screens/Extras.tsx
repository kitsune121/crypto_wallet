import { PageHeader } from '../components/PageHeader';
import { useWallet } from '../store/WalletContext';

export function SwapScreen() {
  const { setView, selectedNetwork, balance } = useWallet();
  return (
    <div className="screen has-bottom-nav">
      <PageHeader title="Swap" onBack={() => setView('home')} />
      <div className="screen-scroll">
        <p className="hint" style={{ marginBottom: 16 }}>
          Swap tokens directly from your wallet on {selectedNetwork.shortName}.
        </p>
        <div className="field">
          <label>You pay</label>
          <input placeholder={`0 ${selectedNetwork.symbol}`} />
          <span className="hint">Balance: {balance} {selectedNetwork.symbol}</span>
        </div>
        <div style={{ textAlign: 'center', margin: '8px 0', color: 'var(--nx-text-muted)' }}>↓</div>
        <div className="field">
          <label>You receive</label>
          <input placeholder="Select a token" disabled />
        </div>
        <div className="warning-box">
          Swaps require a connected liquidity aggregator. Configure a swap API key in a future
          update, or use Send to transfer assets.
        </div>
        <button className="btn btn-primary" disabled>
          Review swap
        </button>
      </div>
    </div>
  );
}

export function ConnectedSitesScreen() {
  const { setView } = useWallet();
  return (
    <div className="screen">
      <PageHeader title="Connected sites" onBack={() => setView('settings')} />
      <div className="empty-state">
        Cryptera is not connected to any sites yet.
        <p className="hint" style={{ marginTop: 8 }}>
          When a dapp requests a connection, you can approve it here — just like MetaMask.
        </p>
      </div>
    </div>
  );
}

export function BuyScreen() {
  const { setView, selectedNetwork } = useWallet();
  return (
    <div className="screen">
      <PageHeader title="Buy" onBack={() => setView('home')} />
      <div className="screen-center">
        <h3 style={{ marginBottom: 8 }}>Buy {selectedNetwork.symbol}</h3>
        <p className="hint" style={{ marginBottom: 20 }}>
          Purchase crypto with a card or bank transfer via a supported on-ramp partner.
        </p>
        <button className="btn btn-primary" disabled>
          Continue with provider
        </button>
        <button className="btn btn-ghost" onClick={() => setView('receive')}>
          Or receive from another wallet
        </button>
      </div>
    </div>
  );
}
