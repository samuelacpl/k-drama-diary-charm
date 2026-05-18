import { Navbar } from "@/components/Navbar";
import { Sparkles } from "lucide-react";

export default function Wrapped() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-2xl py-16 text-center space-y-4">
        <Sparkles size={48} className="mx-auto text-primary" />
        <h1 className="font-display text-3xl font-bold text-foreground">✨ Wrapped</h1>
        <p className="text-muted-foreground">
          Your K-Drama year in review — coming soon 💌
        </p>
      </main>
    </div>
  );
}