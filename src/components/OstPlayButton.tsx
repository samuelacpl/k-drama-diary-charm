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
      toast.error("Anteprima non disponibile per questo brano");
      return;
    }
    if (playing && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
      return;
    }
    // Stop any other audio currently playing on the page (avoid double-tracks)
    document.querySelectorAll("audio").forEach((a) => {
      try { (a as HTMLAudioElement).pause(); } catch {}
    });
    const audio = new Audio(preview);
    // NOTE: no crossOrigin — Deezer CDN previews don't return CORS headers
    // and setting it causes silent playback failures.
    audio.preload = "auto";
    audioRef.current = audio;
    audio.onended = () => { setPlaying(false); audioRef.current = null; };
    audio.onerror = () => {
      setPlaying(false);
      audioRef.current = null;
      toast.error("Anteprima non riproducibile");
    };
    audio.play().then(() => setPlaying(true)).catch((err) => {
      setPlaying(false);
      audioRef.current = null;
      console.warn("[OstPlayButton] play failed", err);
      toast.error("Riproduzione bloccata dal browser");
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