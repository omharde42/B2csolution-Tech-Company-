import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem, NewsPostRow, rowToNewsItem } from '@/lib/newsData';

export const useNews = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('news_posts')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
      if (!active) return;
      setItems(((data as NewsPostRow[] | null) || []).map(rowToNewsItem));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { items, loading };
};
