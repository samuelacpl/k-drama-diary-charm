import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";

/**
 * Shared OST preview play button. Works in any context (form, detail, Osts page).
 * Stops on unmount and on second click.
 */
export default function OstPlayButton({ preview, size = 14 }: { preview?: string; size?: number }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => { audioRef.current?.pause(); audioRef.current = null; }, []);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!preview) {
      toast.error("No preview available for this track");
      return;
    }
    if (playing && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
      return;
    }
    const audio = new Audio(preview);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    audio.onended = () => { setPlaying(false); audioRef.current = null; };
    audio.onerror = () => { setPlaying(false); toast.error("Couldn't play preview"); };
    audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      toast.error("Playback blocked by browser");
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!preview}
      className="p-2 rounded-full bg-blush/40 hover:bg-blush/60 text-foreground transition-colors shrink-0 disabled:opacity-40"
      aria-label={playing ? "Pause preview" : "Play preview"}
    >
      {playing ? <Pause size={size} /> : <Play size={size} />}
    </button>
  );
}