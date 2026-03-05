import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = () => {
  const { showAuth, setShowAuth, login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email, name || email.split('@')[0]);
  };

  return (
    <AnimatePresence>
      {showAuth && (
        <>
          <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" onClick={() => setShowAuth(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-bold">{isSignup ? 'Sign Up' : 'Sign In'}</h2>
                <button onClick={() => setShowAuth(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="w-full rounded-lg bg-accent py-3 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/80">
                  {isSignup ? 'Create Account' : 'Sign In'}
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => setIsSignup(!isSignup)} className="text-accent hover:underline">
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
