import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useWallet } from '../store/WalletContext';

function pickQuizIndices(length: number): number[] {
  if (length <= 0) return [];
  if (length <= 3) return Array.from({ length }, (_, i) => i);
  const idxs = new Set<number>();
  let guard = 0;
  while (idxs.size < 3 && guard < 100) {
    idxs.add(Math.floor(Math.random() * length));
    guard += 1;
  }
  return [...idxs].sort((a, b) => a - b);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ConfirmSeedScreen() {
  const { pendingMnemonic, setView, confirmSeedAndCreate } = useWallet();
  const words = useMemo(
    () => (pendingMnemonic ?? '').trim().split(/\s+/).filter(Boolean),
    [pendingMnemonic],
  );
  const quiz = useMemo(() => pickQuizIndices(words.length), [words]);
  const optionMap = useMemo(() => {
    const map: Record<number, string[]> = {};
    for (const index of quiz) {
      const correct = words[index];
      const distractors = shuffle(words.filter((w) => w !== correct)).slice(0, 2);
      map[index] = shuffle([correct, ...distractors]);
    }
    return map;
  }, [quiz, words]);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!pendingMnemonic || words.length < 12) {
    return (
      <div className="screen">
        <PageHeader title="Confirm Secret Recovery Phrase" onBack={() => setView('secure-wallet')} />
        <div className="screen-scroll">
          <p className="error-text">Secret Recovery Phrase missing. Go back and reveal it again.</p>
          <button className="btn btn-primary" onClick={() => setView('secure-wallet')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const onConfirm = async () => {
    const ok = quiz.every((i) => answers[i] === words[i]);
    if (!ok) {
      setError('Incorrect Secret Recovery Phrase. Please try again.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await confirmSeedAndCreate();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create wallet');
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <PageHeader title="Confirm Secret Recovery Phrase" onBack={() => setView('secure-wallet')} />
      <div className="screen-scroll">
        <p className="hint" style={{ marginBottom: 16 }}>
          Select each word in the order it appears in your Secret Recovery Phrase.
        </p>
        {quiz.map((i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div className="hint" style={{ marginBottom: 8 }}>
              Word #{i + 1}
            </div>
            <div className="chip-row">
              {(optionMap[i] ?? []).map((opt) => (
                <button
                  key={`${i}-${opt}`}
                  className={`chip ${answers[i] === opt ? 'selected' : ''}`}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        {error && <p className="error-text">{error}</p>}
        <button
          className="btn btn-primary"
          disabled={busy || quiz.length === 0 || quiz.some((i) => !answers[i])}
          onClick={onConfirm}
        >
          {busy ? 'Creating...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}
