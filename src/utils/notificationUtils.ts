import { supabase } from '../lib/supabase';

interface Notification {
  type: string;
  projectId: string;
  stakeholders: string[];
}

export async function notify({ type, projectId, stakeholders }: Notification): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .insert(
      stakeholders.map(stakeholderId => ({
        type,
        project_id: projectId,
        user_id: stakeholderId,
        read: false,
      }))
    );

  if (error) {
    console.error('Error creating notifications:', error);
    throw error;
  }
}