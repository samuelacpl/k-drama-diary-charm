import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { getDramas } from '@/lib/store';
import DramaCard from '@/components/DramaCard';

type SortOption = 'date' | 'rating' | 'title' | 'favorites';

export default function Index() {
  const [dramas, setDramas] = useState(getDramas);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('date');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const reload = () => setDramas(getDramas());

  const filtered = useMemo(() => {
    let list = dramas;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.title.toLowerCase().includes(q) || d.actors.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      list = list.filter(d => d.status === statusFilter);
    }
    switch (sort) {
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating);
      case 'title': return [...list].sort((a, b) => a.title.localeCompare(b.title));
      case 'favorites': return [...list].sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
      default: return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [dramas, search, sort, statusFilter]);

  return (
    <div className="container py-6 space-y-6">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-bold text-foreground">My K-Drama Diary 🌸</h1>
        <p className="text-sm text-muted-foreground">Your personal space for K-Drama memories</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dramas..."
            className="w-full rounded-xl border-2 border-border bg-card pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border-2 border-border bg-card px-3 py-2 text-xs font-medium text-foreground focus:outline-none">
            <option value="all">All Status</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
            <option value="plan-to-watch">Plan to Watch</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value as SortOption)} className="rounded-xl border-2 border-border bg-card px-3 py-2 text-xs font-medium text-foreground focus:outline-none">
            <option value="date">Newest</option>
            <option value="rating">Top Rated</option>
            <option value="title">A-Z</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(drama => (
            <DramaCard key={drama.id} drama={drama} onUpdate={reload} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="text-5xl">🎬</span>
          <h2 className="font-display text-xl font-bold text-foreground">No dramas yet!</h2>
          <p className="text-sm text-muted-foreground">Start your diary by adding your first K-Drama</p>
          <Link to="/add" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
            + Add Drama
          </Link>
        </div>
      )}

      {/* FAB */}
      {dramas.length > 0 && (
        <Link
          to="/add"
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95 animate-float"
        >
          <Plus size={24} />
        </Link>
      )}
    </div>
  );
}
