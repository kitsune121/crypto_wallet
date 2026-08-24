import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CrypteraLogo } from '../components/Logo';
import { useWallet } from '../store/WalletContext';
import { CRYPTERA_POSTER, PosterModal } from './Splash';

export function AboutScreen() {
  const { setView } = useWallet();
  const [version, setVersion] = useState('1.0.0');
  const [platform, setPlatform] = useState('web');
  const [posterOpen, setPosterOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      if (!window.CrypteraDesktop?.isElectron) return;
      const [v, p] = await Promise.all([
        window.CrypteraDesktop.getVersion(),
        window.CrypteraDesktop.getPlatform(),
      ]);
      setVersion(v);
      setPlatform(p);
    })();
  }, []);

  return (
    <div className="screen">
      <PageHeader title="About" onBack={() => setView('settings')} />
      <div className="screen-scroll">
        <div className="screen-center" style={{ paddingBottom: 8 }}>
          <CrypteraLogo size={72} />
          <h2 style={{ marginTop: 8 }}>Cryptera</h2>
          <p className="hint">Version {version}</p>
          <p className="hint">
            {window.CrypteraDesktop?.isElectron ? `Desktop · ${platform}` : 'Web'}
          </p>
        </div>

        <div className="settings-group">
          <h3>About us</h3>
          <button className="about-us-card" onClick={() => setPosterOpen(true)}>
            <img src={CRYPTERA_POSTER} alt="" className="about-us-thumb" />
            <div className="about-us-copy">
              <strong>About Cryptera</strong>
              <span>Your crypto. Your future. Tap to view the full story poster.</span>
            </div>
            <ChevronRight size={18} color="#8b9bb8" />
          </button>
          <p className="hint" style={{ padding: '8px 4px 0', lineHeight: 1.45 }}>
            Cryptera is a self-custody crypto wallet. You control your keys. Your Secret Recovery
            Phrase is encrypted and stored locally on this device — we never hold your funds.
          </p>
        </div>

        <div className="settings-group">
          <h3>Links</h3>
          <button className="settings-item">
            <span>Privacy policy</span>
          </button>
          <button className="settings-item">
            <span>Terms of use</span>
          </button>
          <button className="settings-item">
            <span>Visit support</span>
          </button>
        </div>
      </div>

      <PosterModal open={posterOpen} onClose={() => setPosterOpen(false)} />
    </div>
  );
}
