import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useWallet } from '../store/WalletContext';

const HELP_ITEMS: { title: string; body: string }[] = [
  {
    title: 'What is Cryptera?',
    body: 'Cryptera is a self-custody crypto wallet. You control your keys on this device. It is not a bank, broker, or payment app.',
  },
  {
    title: 'Create a wallet',
    body: 'Tap Create a new wallet → set a password → write down your 12-word Secret Recovery Phrase → confirm the words. Never share that phrase with anyone.',
  },
  {
    title: 'Import a wallet',
    body: 'Use Import an existing wallet and enter your Secret Recovery Phrase. This restores the same crypto accounts derived from that phrase into Cryptera on this device.',
  },
  {
    title: 'Unlock & lock',
    body: 'Your password unlocks Cryptera only on this device. Cryptera cannot reset a forgotten password — you must restore with your Secret Recovery Phrase. Use Lock Cryptera in Settings or the menu.',
  },
  {
    title: 'Accounts',
    body: 'Accounts are crypto addresses (Account 1, Account 2, …), not bank accounts. Add more from the account menu. Each account has its own address for receiving funds.',
  },
  {
    title: 'Networks',
    body: 'Switch networks from the network chip (Ethereum, Polygon, Base, etc.). Always send assets on the matching network. Enable Show test networks in Settings for Sepolia / Localhost.',
  },
  {
    title: 'Send',
    body: 'Home → Send. Enter a recipient 0x address, choose an asset and amount, then confirm. You need enough balance for the amount plus network gas fees.',
  },
  {
    title: 'Receive',
    body: 'Home → Receive. Share your address or QR code. Only accept tokens for the selected network.',
  },
  {
    title: 'Tokens & NFTs',
    body: 'Native coins show on Tokens. Import custom ERC-20 tokens via Import tokens. NFT tab is a placeholder for now.',
  },
  {
    title: 'Buy & Swap',
    body: 'Buy and Swap screens are placeholders. They do not connect to banks, cards, or brokers.',
  },
  {
    title: 'What Cryptera does NOT do',
    body: 'No bank or broker connection. No linking to MetaMask/other wallet apps automatically. No hidden trading backend. Connected sites are not live yet.',
  },
  {
    title: 'Stay safe',
    body: 'Never share your Secret Recovery Phrase or private key. Cryptera Support will never ask for them. Prefer testnets for practice. Only use small amounts until you trust your backup.',
  },
  {
    title: 'Run the desktop app',
    body: 'From the project folder run: npm run electron:dev. Or use npm run dev for the browser version at http://127.0.0.1:5173',
  },
];

export function HelpScreen() {
  const { setView } = useWallet();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="screen">
      <PageHeader title="Help" onBack={() => setView('settings')} />
      <div className="screen-scroll">
        <p className="hint" style={{ marginBottom: 16 }}>
          Quick answers for using Cryptera.
        </p>
        {HELP_ITEMS.map((item, i) => {
          const expanded = open === i;
          return (
            <div key={item.title} style={{ borderBottom: '1px solid var(--nx-border-light)' }}>
              <button
                className="settings-item"
                onClick={() => setOpen(expanded ? null : i)}
                style={{ borderBottom: 'none' }}
              >
                <span style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>{item.title}</span>
                {expanded ? (
                  <ChevronDown size={18} color="#6a737d" />
                ) : (
                  <ChevronRight size={18} color="#6a737d" />
                )}
              </button>
              {expanded && (
                <p className="hint" style={{ padding: '0 8px 14px', lineHeight: 1.5 }}>
                  {item.body}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
