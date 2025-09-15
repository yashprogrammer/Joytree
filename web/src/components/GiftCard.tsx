type Props = {
  title: string;
  imageUrl?: string;
  onSelect?: () => void;
  className?: string;
};

export default function GiftCard({ title, imageUrl, onSelect, className }: Props) {
  return (
    <button className={`rounded p-3 text-center hover:bg-gray-50 focus:outline-none focus:ring ${className || ""}`} onClick={onSelect} aria-label={`Select gift ${title}`}>
      {imageUrl ? (
        <div className="w-full aspect-square mb-2 grid place-items-center bg-white">
          <img src={imageUrl} alt="" className="object-contain" style={{ width: "100%", height: "100%" }} />
        </div>
      ) : null}
      <div className="font-medium text-gray-900 text-sm whitespace-normal break-words">{title}</div>
    </button>
  );
}


