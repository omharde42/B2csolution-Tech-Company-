import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Shield } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import b2cLogo from '@/assets/b2csolution-logo.png';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Products' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const { items, setIsOpen } = useCart();
  const { user, isAdmin, setShowAuth, logout } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative text-sm font-medium transition-colors',
      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
      isActive &&
        "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:h-[2px] after:w-6 after:rounded-full after:bg-gradient-to-r after:from-primary after:to-accent",
    );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-border/80 bg-background/80 backdrop-blur-xl shadow-[0_4px_24px_-12px_hsl(var(--primary)/0.4)]'
          : 'border-border/40 bg-background/60 backdrop-blur-md',
      )}
    >
      <div
        className={cn(
          'container mx-auto flex items-center justify-between px-4 transition-all duration-300',
          scrolled ? 'py-2' : 'py-3',
        )}
      >
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <img
              src={b2cLogo}
              alt="B2C Solution"
              className={cn('object-contain transition-all duration-300', scrolled ? 'h-7 w-7' : 'h-8 w-8')}
            />
            <span className="absolute inset-0 rounded-full bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-display text-lg font-bold tracking-wider text-gradient-brand md:text-xl">
            B2C Solution
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
          <NavLink
            to="/community"
            className={({ isActive }) =>
              cn(
                'text-sm font-semibold transition-colors',
                isActive ? 'text-accent' : 'text-accent/90 hover:text-accent',
              )
            }
          >
            Join Us
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors flex items-center gap-1',
                  isActive ? 'text-accent' : 'text-accent/80 hover:text-accent',
                )
              }
            >
              <Shield size={14} /> Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open cart"
            className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-[0_0_10px_hsl(var(--accent)/0.6)]">
                {itemCount}
              </span>
            )}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                aria-label="Open dashboard"
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <User size={20} />
              </button>
              <button onClick={logout} className="hidden sm:inline text-xs text-muted-foreground hover:text-accent">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:scale-[1.03]"
            >
              Sign In
            </button>
          )}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation menu"
            className="md:hidden rounded-lg p-2 text-muted-foreground"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <NavLink
              to="/community"
              onClick={() => setMobileMenu(false)}
              className="rounded-md px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/10"
            >
              Join Us
            </NavLink>
            {user && (
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenu(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                Dashboard
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileMenu(false)}
                className="rounded-md px-3 py-2 text-sm text-accent hover:bg-accent/10 flex items-center gap-1"
              >
                <Shield size={14} /> Admin
              </NavLink>
            )}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenu(false);
                }}
                className="rounded-md px-3 py-2 text-sm text-left text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
