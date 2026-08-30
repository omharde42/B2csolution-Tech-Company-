import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SEO from '@/components/SEO';
import { toast } from '@/hooks/use-toast';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  email: z.string().trim().email('Enter a valid email address').max(255),
  phone: z.string().trim().min(7, 'Enter a valid contact number').max(20),
  dob: z.string().min(1, 'Please select your date of birth'),
  business: z.string().trim().max(100).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});

const SignUp = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '', business: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const result = await signup(parsed.data.email, parsed.data.password, parsed.data.name, {
      phone: parsed.data.phone,
      dob: parsed.data.dob,
      business: parsed.data.business || '',
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    toast({ title: 'Account created', description: 'You can now sign in with your email and password.' });
    navigate('/signin', { replace: true });
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <>
      <SEO
        title="Create Your B2CSolution Account"
        description="Sign up to track orders, raise support tickets and manage your website and automation projects with B2CSolution."
      />
      <section className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-lg bg-accent/10 p-2 text-accent"><UserPlus size={20} /></span>
            <div>
              <h1 className="font-display text-2xl font-bold">Create your account</h1>
              <p className="text-xs text-muted-foreground">Takes less than a minute. Then sign in and start tracking your projects.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <input value={form.name} onChange={set('name')} placeholder="Full name" maxLength={100} className={inputClass} />
            <input type="email" value={form.email} onChange={set('email')} placeholder="Email address" maxLength={255} className={inputClass} />
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="Contact number (WhatsApp preferred)" maxLength={20} className={inputClass} />
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Date of birth</label>
              <input type="date" value={form.dob} onChange={set('dob')} max={new Date().toISOString().slice(0, 10)} className={inputClass} />
            </div>
            <input value={form.business} onChange={set('business')} placeholder="Business / brand name (optional)" maxLength={100} className={inputClass} />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="Password (min 8 characters)"
                maxLength={72}
                className={inputClass + ' pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/80 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account? <Link to="/signin" className="text-accent hover:underline">Sign In</Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default SignUp;
