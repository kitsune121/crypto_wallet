import { useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Copy,
  MoreVertical,
  RefreshCw,
  Scan,
} from 'lucide-react';
import { Identicon } from '../components/Logo';
import { copyToClipboard, estimateUsd, formatBalance, formatFiat } from '../lib/format';
import { shortenAddress } from '../lib/hd';
import { useWallet } from '../store/WalletContext';
import { AccountMenu } from './AccountMenu';
import { NetworkMenu } from './NetworkMenu';

type Tab = 'tokens' | 'nfts' | 'activity';

export function HomeScreen() {
  const {
    selectedAccount,
    selectedNetwork,
    balance,
    tokenBalances,
    vault,
    loadingBalance,
    refreshBalances,
    setView,
    lock,
  } = useWallet();
  const [tab, setTab] = useState<Tab>('tokens');
  const [showNetwork, setShowNetwork] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fiat = useMemo(
    () => estimateUsd(balance, selectedNetwork.symbol),
    [balance, selectedNetwork.symbol],
  );

  const tokens = (vault?.tokens ?? []).filter((t) => t.chainId === selectedNetwork.chainId);
  const activity = (vault?.transactions ?? []).filter((t) => t.chainId === selectedNetwork.chainId);

  const onCopy = async () => {
    if (!selectedAccount) return;
    await copyToClipboard(selectedAccount.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (!selectedAccount) {
    return (
      <div className="screen">
        <div className="screen-center">
          <p className="hint">Loading account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen has-bottom-nav">
      <div className="header-bar">
        <button className="network-chip" onClick={() => setShowNetwork(true)}>
          <span className="network-dot" style={{ background: selectedNetwork.color }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedNetwork.shortName}
          </span>
          <ChevronDown size={14} />
        </button>

        <button className="account-chip" onClick={() => setShowAccount(true)}>
          <Identicon address={selectedAccount.address} />
          <div className="account-chip-text">
            <strong>{selectedAccount.name}</strong>
            <span>{shortenAddress(selectedAccount.address)}</span>
          </div>
          <ChevronDown size={14} />
        </button>

        <div style={{ display: 'flex', gap: 2 }}>
          <button className="icon-btn" onClick={() => void refreshBalances()} aria-label="Refresh">
            <RefreshCw size={18} className={loadingBalance ? 'spin' : ''} />
          </button>
          <button className="icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 56,
            right: 10,
            background: '#fff',
            border: '1px solid var(--nx-border)',
            borderRadius: 8,
            boxShadow: 'var(--nx-shadow)',
            zIndex: 30,
            minWidth: 180,
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'Account details', action: () => setView('account-details') },
            { label: 'View on explorer', action: () => window.open(`${selectedNetwork.explorerUrl}/address/${selectedAccount.address}`, '_blank') },
            { label: 'Help', action: () => setView('help') },
            { label: 'Settings', action: () => setView('settings') },
            { label: 'Lock Cryptera', action: lock },
          ].map((item) => (
            <button
              key={item.label}
              className="list-item"
              onClick={() => {
                setMenuOpen(false);
                item.action();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="balance-block">
        <div className="balance-fiat">{formatFiat(fiat)}</div>
        <div className="balance-native">
          {formatBalance(balance)} {selectedNetwork.symbol}
        </div>
        <button className="copy-pill" style={{ marginTop: 12 }} onClick={onCopy}>
          <Copy size={12} />
          {copied ? 'Copied!' : shortenAddress(selectedAccount.address, 6)}
        </button>
      </div>

      <div className="action-row">
        <button className="action-btn" onClick={() => setView('buy')}>
          <span className="circle">
            <Scan size={18} />
          </span>
          Buy
        </button>
        <button className="action-btn" onClick={() => setView('swap')}>
          <span className="circle" style={{ transform: 'rotate(90deg)' }}>
            <ArrowUpRight size={18} />
          </span>
          Swap
        </button>
        <button className="action-btn" onClick={() => setView('send')}>
          <span className="circle">
            <ArrowUpRight size={18} />
          </span>
          Send
        </button>
        <button className="action-btn" onClick={() => setView('receive')}>
          <span className="circle">
            <ArrowDownLeft size={18} />
          </span>
          Receive
        </button>
      </div>

      <div className="tabs">
        {(['tokens', 'nfts', 'activity'] as Tab[]).map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'tokens' ? 'Tokens' : t === 'nfts' ? 'NFTs' : 'Activity'}
          </button>
        ))}
      </div>

      <div className="screen-scroll" style={{ paddingTop: 4 }}>
        {tab === 'tokens' && (
          <>
            <button className="token-row" style={{ cursor: 'default' }}>
              <div className="token-icon" style={{ background: selectedNetwork.color }}>
                {selectedNetwork.symbol.slice(0, 1)}
              </div>
              <div className="token-meta">
                <strong>{selectedNetwork.symbol}</strong>
                <span>{formatFiat(fiat)}</span>
              </div>
              <div className="token-amounts">
                <strong>{formatBalance(balance)}</strong>
                <span>{selectedNetwork.symbol}</span>
              </div>
            </button>
            {tokens.map((token) => {
              const bal = tokenBalances[token.address.toLowerCase()] ?? '0';
              const usd = estimateUsd(bal, token.symbol);
              return (
                <div className="token-row" key={token.address}>
                  <div className="token-icon" style={{ background: '#627EEA' }}>
                    {token.symbol.slice(0, 1)}
                  </div>
                  <div className="token-meta">
                    <strong>{token.symbol}</strong>
                    <span>{token.name}</span>
                  </div>
                  <div className="token-amounts">
                    <strong>{formatBalance(bal)}</strong>
                    <span>{formatFiat(usd)}</span>
                  </div>
                </div>
              );
            })}
            <button className="btn btn-ghost" onClick={() => setView('import-token')}>
              + Import tokens
            </button>
          </>
        )}

        {tab === 'nfts' && (
          <div className="empty-state">
            No NFTs yet
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-secondary" style={{ width: 'auto', margin: '0 auto' }}>
                Import NFT
              </button>
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <>
            {activity.length === 0 && <div className="empty-state">You have no transactions</div>}
            {activity.map((tx) => (
              <button
                key={tx.hash}
                className="activity-row"
                onClick={() =>
                  selectedNetwork.explorerUrl &&
                  window.open(`${selectedNetwork.explorerUrl}/tx/${tx.hash}`, '_blank')
                }
              >
                <div
                  className="token-icon"
                  style={{ background: tx.direction === 'sent' ? '#eef0f2' : '#e8f7ec', color: '#24272a' }}
                >
                  {tx.direction === 'sent' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                </div>
                <div className="token-meta">
                  <strong>{tx.direction === 'sent' ? 'Sent' : 'Received'}</strong>
                  <span>{new Date(tx.timestamp).toLocaleString()}</span>
                </div>
                <div className="token-amounts">
                  <strong>
                    {tx.direction === 'sent' ? '-' : '+'}
                    {formatBalance(tx.value)} {tx.symbol}
                  </strong>
                  <span className={`status-pill ${tx.status}`}>{tx.status}</span>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {showNetwork && <NetworkMenu onClose={() => setShowNetwork(false)} />}
      {showAccount && <AccountMenu onClose={() => setShowAccount(false)} />}
    </div>
  );
}
