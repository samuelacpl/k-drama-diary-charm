import { Loader2 } from "lucide-react";

export function Loader({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-2 ${className}`}>
      <Loader2 className="animate-spin text-primary" size={28} />
      {label && <p className="text-xs text-muted-foreground animate-pulse">{label}</p>}
    </div>
  );
}

export default Loader;