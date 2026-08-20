import { supabase } from '@/integrations/supabase/client';

export type AuditAction =
  | 'export_orders_csv'
  | 'export_orders_pdf'
  | 'export_inquiries_csv'
  | 'export_inquiries_pdf'
  | 'view_orders'
  | 'view_inquiries'
  | 'view_customer_details'
  | 'update_order_status';

/**
 * Record an admin action (data export or sensitive record access).
 * Fails silently — auditing must never block the admin UI.
 */
export const logAdminAction = async (
  action: AuditAction,
  opts: { resource: string; resourceId?: string | null; details?: string; recordCount?: number } ,
) => {
  try {
    const { data } = await supabase.auth.getUser();
    const adminId = data.user?.id;
    if (!adminId) return;
    await supabase.from('admin_audit_log').insert({
      admin_id: adminId,
      action,
      resource: opts.resource,
      resource_id: opts.resourceId ?? null,
      details: opts.details ?? '',
      record_count: opts.recordCount ?? 0,
    });
  } catch (e) {
    console.error('audit log failed', e);
  }
};
