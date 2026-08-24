import { useCallback, useState } from 'react';
import { WalletProvider, useWallet } from './store/WalletContext';
import { ToastProvider } from './components/Toast';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './screens/Splash';
import { WelcomeScreen } from './screens/Welcome';
import { CreatePasswordScreen } from './screens/CreatePassword';
import { SecureWalletScreen } from './screens/SecureWallet';
import { ConfirmSeedScreen } from './screens/ConfirmSeed';
import { ImportWalletScreen } from './screens/ImportWallet';
import { UnlockScreen } from './screens/Unlock';
import { HomeScreen } from './screens/Home';
import { SendScreen } from './screens/Send';
import { ReceiveScreen } from './screens/Receive';
import { SettingsScreen } from './screens/Settings';
import { ImportTokenScreen } from './screens/ImportToken';
import { AccountDetailsScreen } from './screens/AccountDetails';
import { RevealSeedScreen } from './screens/RevealSeed';
import { NetworksScreen } from './screens/Networks';
import { AboutScreen } from './screens/About';
import { HelpScreen } from './screens/Help';
import { ConnectedSitesScreen, SwapScreen } from './screens/Extras';
import { ActivityScreen } from './screens/Activity';
import { AccountMenu } from './screens/AccountMenu';

function Router() {
  const { view, setView } = useWallet();

  switch (view) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'create-password':
      return <CreatePasswordScreen />;
    case 'secure-wallet':
      return <SecureWalletScreen />;
    case 'confirm-seed':
      return <ConfirmSeedScreen />;
    case 'import-wallet':
      return <ImportWalletScreen />;
    case 'unlock':
      return <UnlockScreen />;
    case 'home':
    case 'buy':
      return <HomeScreen />;
    case 'send':
      return <SendScreen />;
    case 'receive':
      return <ReceiveScreen />;
    case 'swap':
    case 'bridge':
      return <SwapScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'networks':
      return <NetworksScreen />;
    case 'import-token':
      return <ImportTokenScreen />;
    case 'account-details':
      return <AccountDetailsScreen />;
    case 'accounts':
      return (
        <div className="screen">
          <AccountMenu onClose={() => setView('home')} />
        </div>
      );
    case 'reveal-seed':
      return <RevealSeedScreen />;
    case 'connected-sites':
      return <ConnectedSitesScreen />;
    case 'about':
      return <AboutScreen />;
    case 'help':
      return <HelpScreen />;
    case 'activity':
      return <ActivityScreen />;
    case 'contacts':
    case 'tips':
      return <HelpScreen />;
    default:
      return <HomeScreen />;
  }
}

function Shell() {
  return (
    <>
      <Router />
      <BottomNav />
    </>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const finishSplash = useCallback(() => setShowSplash(false), []);

  return (
    <div className="app-shell cryptera">
      <div className="wallet-frame">
        {showSplash ? (
          <SplashScreen onDone={finishSplash} />
        ) : (
          <ToastProvider>
            <WalletProvider>
              <Shell />
            </WalletProvider>
          </ToastProvider>
        )}
      </div>
    </div>
  );
}
