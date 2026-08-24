import { ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useWallet } from '../store/WalletContext';

export function SettingsScreen() {
  const { setView, vault, lock, updateSettings, setShowTestNetworks } = useWallet();

  return (
    <div className="screen has-bottom-nav">
      <PageHeader title="Settings" onBack={() => setView('home')} />
      <div className="screen-scroll">
        <div className="settings-group">
          <h3>General</h3>
          <button className="settings-item" onClick={() => setView('networks')}>
            <span>Networks</span>
            <ChevronRight size={18} color="#6a737d" />
          </button>
          <div className="settings-item">
            <span>Currency conversion</span>
            <select
              value={vault?.currency ?? 'USD'}
              onChange={(e) => void updateSettings({ currency: e.target.value })}
              style={{ border: 'none', background: 'transparent', fontWeight: 600 }}
            >
              {['USD', 'EUR', 'GBP', 'JPY'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="settings-item">
            <span>Auto-lock timer (min)</span>
            <select
              value={vault?.autoLockMinutes ?? 5}
              onChange={(e) => void updateSettings({ autoLockMinutes: Number(e.target.value) })}
              style={{ border: 'none', background: 'transparent', fontWeight: 600 }}
            >
              {[0, 1, 5, 10, 30, 60].map((m) => (
                <option key={m} value={m}>
                  {m === 0 ? 'Never' : m}
                </option>
              ))}
            </select>
          </div>
          <div className="settings-item">
            <span>Show test networks</span>
            <button
              className={`toggle ${vault?.showTestNetworks ? 'on' : ''}`}
              onClick={() => void setShowTestNetworks(!vault?.showTestNetworks)}
            />
          </div>
        </div>

        <div className="settings-group">
          <h3>Security & privacy</h3>
          <button className="settings-item" onClick={() => setView('reveal-seed')}>
            <span>Reveal Secret Recovery Phrase</span>
            <ChevronRight size={18} color="#6a737d" />
          </button>
          <button className="settings-item" onClick={() => setView('account-details')}>
            <span>Show private key</span>
            <ChevronRight size={18} color="#6a737d" />
          </button>
          <button className="settings-item" onClick={lock}>
            <span>Lock Cryptera</span>
            <ChevronRight size={18} color="#6a737d" />
          </button>
        </div>

        <div className="settings-group">
          <h3>Advanced</h3>
          <button className="settings-item" onClick={() => setView('import-token')}>
            <span>Import tokens</span>
            <ChevronRight size={18} color="#6a737d" />
          </button>
          <button className="settings-item" onClick={() => setView('connected-sites')}>
            <span>Connected sites</span>
            <ChevronRight size={18} color="#6a737d" />
          </button>
        </div>

        <div className="settings-group">
          <h3>About</h3>
          <button className="settings-item" onClick={() => setView('help')}>
            <span>Help</span>
            <ChevronRight size={18} color="#6a737d" />
          </button>
          <button className="settings-item" onClick={() => setView('about')}>
            <span>About us</span>
            <ChevronRight size={18} color="#6a737d" />
          </button>
          <button className="settings-item" onClick={() => setView('about')}>
            <span>About Cryptera</span>
            <ChevronRight size={18} color="#6a737d" />
          </button>
        </div>
      </div>
    </div>
  );
}
