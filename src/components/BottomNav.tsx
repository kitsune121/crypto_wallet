import { Activity, ArrowLeftRight, Home, Settings, Wallet } from 'lucide-react';
import type { AppView } from '../types/wallet';
import { useWallet } from '../store/WalletContext';

const TABS: { id: AppView; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'accounts', label: 'Wallets', icon: Wallet },
  { id: 'swap', label: 'Swap', icon: ArrowLeftRight },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const { view, setView, unlocked } = useWallet();

  if (!unlocked) return null;
  if (!TABS.some((t) => t.id === view) && view !== 'buy') return null;

  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = view === tab.id || (tab.id === 'home' && view === 'buy');
        return (
          <button
            key={tab.id}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setView(tab.id)}
          >
            <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
