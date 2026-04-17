import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

// reCAPTCHA v2 site key. Set VITE_RECAPTCHA_SITE_KEY in env (publishable key — safe in client) for production.
// Falls back to Google's official test key (always passes — DO NOT use in production).
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const AuthModal = () => {
  const { showAuth, setShowAuth, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef<HTMLDivElement>(null);
  const captchaWidgetId = useRef<number | null>(null);

  // Load reCAPTCHA script
  useEffect(() => {
    if (document.getElementById('recaptcha-script')) {
      if (window.grecaptcha?.render) setCaptchaReady(true);
      return;
    }
    window.onRecaptchaLoad = () => setCaptchaReady(true);
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // Render captcha widget
  useEffect(() => {
    if (captchaReady && captchaRef.current && showAuth && captchaWidgetId.current === null) {
      try {
        captchaWidgetId.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: (token: string) => setCaptchaToken(token),
          'expired-callback': () => setCaptchaToken(''),
          theme: 'dark',
          size: 'normal',
        });
      } catch (e) {
        // Widget already rendered
      }
    }
  }, [captchaReady, showAuth, mode]);

  // Reset captcha when modal closes or mode changes
  useEffect(() => {
    if (!showAuth) {
      captchaWidgetId.current = null;
      setCaptchaToken('');
    }
  }, [showAuth]);

  useEffect(() => {
    setCaptchaToken('');
    captchaWidgetId.current = null;
    setError('');
  }, [mode]);

  const resetCaptcha = () => {
    if (window.grecaptcha && captchaWidgetId.current !== null) {
      try { window.grecaptcha.reset(captchaWidgetId.current); } catch {}
    }
    setCaptchaToken('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!captchaToken && mode !== 'forgot') {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          setError(error.message);
        } else {
          toast({ title: 'Password reset email sent', description: `Check ${email} for a reset link.` });
          setMode('login');
        }
      } else if (mode === 'signup') {
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); resetCaptcha(); return; }
        const result = await signup(email, password, name || email.split('@')[0]);
        if (result.error) { setError(result.error); resetCaptcha(); }
      } else {
        const result = await login(email, password);
        if (result.error) { setError(result.error); resetCaptcha(); }
      }
    } catch {
      setError('Something went wrong');
      resetCaptcha();
    }
    setLoading(false);
  };

  const inputClass = "w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

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
            <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold">
                  {mode === 'forgot' ? 'Reset Password' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
                </h2>
                <button onClick={() => setShowAuth(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>

              {error && (
                <div className="mb-3 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className={inputClass} />
                )}

                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className={inputClass} />

                {mode !== 'forgot' && (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      minLength={6}
                      className={inputClass + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}

                {/* reCAPTCHA */}
                {mode !== 'forgot' && (
                  <div className="flex justify-center">
                    <div ref={captchaRef} key={mode} />
                  </div>
                )}

                {mode !== 'forgot' && mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-accent hover:underline block w-full text-right"
                  >
                    Forgot Password?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading || (mode !== 'forgot' && !captchaToken)}
                  className="w-full rounded-lg bg-accent py-3 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/80 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {mode === 'forgot' ? 'Send Reset Link' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                {mode === 'forgot' ? (
                  <button onClick={() => setMode('login')} className="text-accent hover:underline">Back to Sign In</button>
                ) : mode === 'signup' ? (
                  <>Already have an account? <button onClick={() => setMode('login')} className="text-accent hover:underline">Sign In</button></>
                ) : (
                  <>Don't have an account? <button onClick={() => setMode('signup')} className="text-accent hover:underline">Sign Up</button></>
                )}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
