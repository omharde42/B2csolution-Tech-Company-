import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const getVisitorId = () => {
  let id = localStorage.getItem('b2c_visitor');
  if (!id) {
    id = Math.random().toString(36).slice(2);
    localStorage.setItem('b2c_visitor', id);
  }
  return id;
};

export const usePageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    supabase.from('page_views').insert({
      page: location.pathname,
      visitor_id: getVisitorId(),
    }).then(() => {});
  }, [location.pathname]);
};
