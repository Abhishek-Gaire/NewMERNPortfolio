import { supabase } from '../lib/supabase';

interface AuditLog {
  action: string;
  resourceId: string;
  details: any;
  userId?: string;
}

export async function createAuditLog(log: AuditLog): Promise<void> {
  const { error } = await supabase
    .from('audit_logs')
    .insert([{
      ...log,
      timestamp: new Date().toISOString(),
    }]);

  if (error) {
    console.error('Error creating audit log:', error);
    throw error;
  }
}