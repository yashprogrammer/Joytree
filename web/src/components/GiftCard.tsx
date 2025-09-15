type Props = {
  title: string;
  imageUrl?: string;
  onSelect?: () => void;
};

export default function GiftCard({ title, imageUrl, onSelect }: Props) {
  return (
    <button className="border rounded p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring" onClick={onSelect} aria-label={`Select gift ${title}`}>
      {imageUrl ? (
        <div className="w-full aspect-square mb-2 grid place-items-center bg-white">
          <img src={imageUrl} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      ) : null}
      <div className="font-medium">{title}</div>
    </button>
  );
}


