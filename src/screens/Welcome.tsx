import { CrypteraLogo } from '../components/Logo';
import { useWallet } from '../store/WalletContext';

export function WelcomeScreen() {
  const { startCreateWallet, startImportWallet } = useWallet();

  return (
    <div className="screen">
      <div className="screen-center">
        <CrypteraLogo size={104} />
        <h1 className="brand-title">Cryptera</h1>
        <p className="brand-sub">
          Your crypto. Your future. The next generation non-custodial wallet.
        </p>
        <div className="feature-row" style={{ marginBottom: 20 }}>
          {[
            ['Ultra Secure', 'Bank-level security'],
            ['Multi-Chain', 'Manage your assets'],
            ['Fast & Easy', 'Send · receive · swap'],
            ['Non-Custodial', 'You own your keys'],
          ].map(([t, s]) => (
            <div key={t} className="feature-chip">
              <strong>{t}</strong>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="btn-stack">
          <button className="btn btn-primary" onClick={startCreateWallet}>
            Create a new wallet
          </button>
          <button className="btn btn-secondary" onClick={startImportWallet}>
            Import an existing wallet
          </button>
        </div>
      </div>
    </div>
  );
}
