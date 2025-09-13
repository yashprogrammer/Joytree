type Props = {
  title: string;
  imageUrl?: string;
  onSelect?: () => void;
};

export default function GiftCard({ title, imageUrl, onSelect }: Props) {
  return (
    <button className="border rounded p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring" onClick={onSelect} aria-label={`Select gift ${title}`}>
      {imageUrl ? <img src={imageUrl} alt="" className="w-full h-32 object-cover mb-2" /> : null}
      <div className="font-medium">{title}</div>
    </button>
  );
}


