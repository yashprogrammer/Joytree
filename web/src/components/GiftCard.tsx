type Props = {
  title: string;
  imageUrl?: string;
  onSelect?: () => void;
  className?: string;
};

export default function GiftCard({ title, imageUrl, onSelect, className }: Props) {
  return (
    <button 
      className={`
        gift-card-animated gift-card-hover
        relative rounded-2xl p-4 text-center 
        bg-white shadow-lg
        hover:shadow-2xl
        focus:outline-none focus:ring-4 focus:ring-[var(--brand-primary)]/30
        transition-all duration-300
        border-2 border-transparent
        group
        ${className || ""}
      `} 
      onClick={onSelect} 
      aria-label={`Select gift ${title}`}
    >
      {/* Shine overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      
      {imageUrl ? (
        <div className="relative w-full aspect-square mb-3 grid place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white">
          <img 
            src={imageUrl} 
            alt="" 
            className="gift-image-float object-contain transition-transform duration-300 group-hover:scale-110" 
            style={{ width: "85%", height: "85%" }} 
          />
          
          {/* Sparkle element */}
          <div className="absolute top-2 right-2 text-yellow-400 text-2xl animate-[sparkle_2s_ease-in-out_infinite]">
            ✨
          </div>
        </div>
      ) : null}
      
      <div className="font-semibold text-gray-900 text-base mb-1 whitespace-normal break-words">
        {title}
      </div>
      
      {/* "Choose Me" badge appears on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
          Choose Me! 🎁
        </span>
      </div>
    </button>
  );
}


