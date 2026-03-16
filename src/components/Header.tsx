import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Shield } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import b2cLogo from '@/assets/b2csolution-logo.png';

const Header = () => {
  const { items, setIsOpen } = useCart();
  const { user, isAdmin, setShowAuth, logout } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={b2cLogo} alt="B2C Solution" className="h-8 w-8 object-contain" />
          <span className="font-display text-lg font-bold tracking-wider text-gradient-brand md:text-xl">
            B2C Solution
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Products</Link>
          <Link to="/reviews" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Reviews</Link>
          <Link to="/team" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Team</Link>
          <Link to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
          {user && (
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-accent transition-colors hover:text-accent/80 flex items-center gap-1">
              <Shield size={14} /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/dashboard')} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <User size={20} />
              </button>
              <button onClick={logout} className="text-xs text-muted-foreground hover:text-accent">Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80">
              Sign In
            </button>
          )}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden rounded-lg p-2 text-muted-foreground">
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileMenu(false)} className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/services" onClick={() => setMobileMenu(false)} className="text-sm text-muted-foreground hover:text-foreground">Products</Link>
            <Link to="/reviews" onClick={() => setMobileMenu(false)} className="text-sm text-muted-foreground hover:text-foreground">Reviews</Link>
            <Link to="/team" onClick={() => setMobileMenu(false)} className="text-sm text-muted-foreground hover:text-foreground">Team</Link>
            <Link to="/contact" onClick={() => setMobileMenu(false)} className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
            {user && <Link to="/dashboard" onClick={() => setMobileMenu(false)} className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMobileMenu(false)} className="text-sm text-accent hover:text-accent/80 flex items-center gap-1"><Shield size={14} /> Admin</Link>}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
