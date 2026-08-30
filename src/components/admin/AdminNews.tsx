import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsPostRow } from '@/lib/newsData';
import { Loader2, Plus, Trash2, Save, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';

const emptyDraft = () => ({
  id: '',
  slug: '',
  title: '',
  badge: 'Update',
  date_label: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  published: false,
  sort_order: 0,
});

type Draft = ReturnType<typeof emptyDraft>;

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

const AdminNews = () => {
  const [posts, setPosts] = useState<NewsPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .order('sort_order', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) toast.error('Could not load news posts');
    setPosts((data as NewsPostRow[] | null) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () =>
    setDraft({
      ...emptyDraft(),
      date_label: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      sort_order: (posts[0]?.sort_order ?? 0) + 10,
    });

  const startEdit = (p: NewsPostRow) =>
    setDraft({
      id: p.id,
      slug: p.slug,
      title: p.title,
      badge: p.badge,
      date_label: p.date_label,
      excerpt: p.excerpt,
      content: p.content,
      cover_image_url: p.cover_image_url || '',
      published: p.published,
      sort_order: p.sort_order,
    });

  const save = async (publish?: boolean) => {
    if (!draft) return;
    const title = draft.title.trim();
    if (!title) return toast.error('Title is required');
    const slug = slugify(draft.slug || title);
    if (!slug) return toast.error('Slug is required');

    setSaving(true);
    const payload = {
      slug,
      title,
      badge: draft.badge.trim() || 'Update',
      date_label: draft.date_label.trim(),
      excerpt: draft.excerpt.trim(),
      content: draft.content,
      cover_image_url: draft.cover_image_url.trim() || null,
      published: publish ?? draft.published,
      sort_order: Number(draft.sort_order) || 0,
    };

    const { error } = draft.id
      ? await supabase.from('news_posts').update(payload).eq('id', draft.id)
      : await supabase.from('news_posts').insert(payload);

    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(payload.published ? 'News update published' : 'Draft saved');
    setDraft(null);
    load();
  };

  const togglePublish = async (p: NewsPostRow) => {
    const { error } = await supabase
      .from('news_posts')
      .update({ published: !p.published })
      .eq('id', p.id);
    if (error) return toast.error(error.message);
    toast.success(!p.published ? 'Published' : 'Unpublished');
    load();
  };

  const remove = async (p: NewsPostRow) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('news_posts').delete().eq('id', p.id);
    if (error) return toast.error(error.message);
    toast.success('Deleted');
    load();
  };

  const field = 'w-full rounded-lg bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40';

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold">News Editor</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Create, edit and publish updates shown on /news</p>
        </div>
        {!draft && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs sm:text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            <Plus size={15} /> New update
          </button>
        )}
      </div>

      {draft && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-background/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-bold">{draft.id ? 'Edit update' : 'New update'}</p>
            <button onClick={() => setDraft(null)} aria-label="Close editor" className="p-1 rounded-md text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>

          <input className={field} placeholder="Title" value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })} />

          <div className="grid gap-3 sm:grid-cols-3">
            <input className={field} placeholder="URL slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            <input className={field} placeholder="Badge (New / Update)" value={draft.badge} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} />
            <input className={field} placeholder="Date label (April 2026)" value={draft.date_label} onChange={(e) => setDraft({ ...draft, date_label: e.target.value })} />
          </div>

          <input className={field} placeholder="Cover image URL (optional)" value={draft.cover_image_url}
            onChange={(e) => setDraft({ ...draft, cover_image_url: e.target.value })} />

          {draft.cover_image_url.trim() && (
            <img src={draft.cover_image_url} alt="Cover preview" className="h-32 w-full rounded-lg object-cover border border-border" />
          )}

          <textarea className={field} rows={2} placeholder="Short excerpt shown on the news card"
            value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />

          <textarea className={`${field} font-mono`} rows={10}
            placeholder="Full article content. Separate paragraphs with a blank line."
            value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Sort order
              <input type="number" className="w-24 rounded-lg bg-secondary border border-border px-2 py-1.5 text-sm"
                value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} />
            </label>
            <div className="flex-1" />
            <button disabled={saving} onClick={() => save(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-secondary transition disabled:opacity-50">
              <Save size={14} /> Save draft
            </button>
            <button disabled={saving} onClick={() => save(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />} Publish
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">Live at /news/{slugify(draft.slug || draft.title) || 'your-slug'}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" size={22} /></div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No news updates yet. Create your first one.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border bg-background/40 p-3 sm:p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${p.published ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary text-muted-foreground border border-border'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{p.date_label}</span>
                </div>
                <p className="mt-1 font-display text-sm font-bold truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground truncate">/news/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(p)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition">Edit</button>
                <button onClick={() => togglePublish(p)} aria-label={p.published ? 'Unpublish' : 'Publish'}
                  className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition">
                  {p.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => remove(p)} aria-label="Delete"
                  className="rounded-lg border border-destructive/30 p-2 text-destructive hover:bg-destructive/10 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNews;
