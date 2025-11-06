import { supabase } from '../lib/supabase';
import { Task } from '../types';

export const taskService = {
  async getTasks(userId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority as 'Elite' | 'Core' | 'Bonus',
      completed: task.completed,
      xp: task.xp,
      category: task.category,
      dueDate: new Date(task.due_date || Date.now()),
      createdAt: new Date(task.created_at),
      streak: task.streak,
    }));
  },

  async createTask(userId: string, task: Omit<Task, 'id'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: task.completed,
        xp: task.xp,
        category: task.category,
        due_date: task.dueDate.toISOString(),
        streak: task.streak,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTask(userId: string, taskId: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        completed: updates.completed,
        xp: updates.xp,
        category: updates.category,
        due_date: updates.dueDate?.toISOString(),
        streak: updates.streak,
      })
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTask(userId: string, taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};