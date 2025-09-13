type Props = {
  src: string;
  onAcknowledged: () => void;
};

export default function VideoPlayer({ src, onAcknowledged }: Props) {
  return (
    <div className="grid gap-2">
      <video className="w-full rounded" src={src} controls aria-label="Campaign video" />
      <button className="px-3 py-2 border rounded" onClick={onAcknowledged}>I've watched this video</button>
    </div>
  );
}


