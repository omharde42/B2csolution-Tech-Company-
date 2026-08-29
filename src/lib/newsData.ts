export interface NewsItem {
  slug: string;
  date: string;
  badge: string;
  title: string;
  excerpt: string;
  content: string[];
}

export interface NewsPostRow {
  id: string;
  slug: string;
  title: string;
  badge: string;
  date_label: string;
  excerpt: string;
  content: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const rowToNewsItem = (row: NewsPostRow): NewsItem => ({
  slug: row.slug,
  date: row.date_label,
  badge: row.badge,
  title: row.title,
  excerpt: row.excerpt,
  content: (row.content || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean),
});
