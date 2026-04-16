import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Auth() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (user) return <Navigate to="/" replace />;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back! 🌸');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Check your email to confirm your account! 📧');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error('Google sign-in failed');
    }
  };

  const inputClass = "w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-foreground">🌸 K-Drama Diary</h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <button onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-border bg-card py-3 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={inputClass} required minLength={6} />
          <button type="submit" disabled={submitting}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {submitting ? '...' : isLogin ? '🌸 Sign In' : '🌸 Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
