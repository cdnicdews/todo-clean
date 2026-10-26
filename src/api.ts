import { createClient } from '@supabase/supabase-js';
import type { Todo } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchTodos(): Promise<Todo[]> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    throw error;
  }
}

export async function addTodo(text: string): Promise<Todo> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .insert({ text, is_complete: false })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Ошибка добавления:', error);
    throw error;
  }
}

export async function toggleTodo(id: string, is_complete: boolean): Promise<void> {
  try {
    const { error } = await supabase.from('todos').update({ is_complete }).eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Ошибка обновления:', error);
    throw error;
  }
}

export async function deleteTodo(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Ошибка удаления:', error);
    throw error;
  }
}