type Props = {
  title: string;
  imageUrl?: string;
  onSelect?: () => void;
};

export default function GiftCard({ title, imageUrl, onSelect }: Props) {
  return (
    <button className="border border-[var(--color-border)] rounded p-4 text-left bg-[var(--color-surface)] hover:bg-[var(--color-brand)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" onClick={onSelect} aria-label={`Select gift ${title}`}>
      {imageUrl ? <img src={imageUrl} alt="" className="w-full h-32 object-cover mb-2" /> : null}
      <div className="font-medium text-[var(--color-foreground)]">{title}</div>
    </button>
  );
}


