import { ArrowLeft } from 'lucide-react';

export function PageHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <div className="page-header">
      {onBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
      <h2>{title}</h2>
    </div>
  );
}
