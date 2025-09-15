type Props = {
  title: string;
  imageUrl?: string;
  onSelect?: () => void;
};

export default function GiftCard({ title, imageUrl, onSelect }: Props) {
  return (
    <button className="border rounded p-3 text-left hover:bg-gray-50 focus:outline-none focus:ring" onClick={onSelect} aria-label={`Select gift ${title}`}>
      {imageUrl ? (
        <div className="w-full aspect-square mb-2 grid place-items-center bg-white">
          <img src={imageUrl} alt="" className="object-contain" style={{ width: "100%", height: "100%" }} />
        </div>
      ) : null}
      <div className="font-medium text-gray-900 text-sm truncate">{title}</div>
    </button>
  );
}


