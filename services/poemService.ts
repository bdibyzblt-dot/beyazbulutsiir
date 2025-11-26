
import { supabase } from './supabaseClient';
import { Poem, Category } from "../types";

export const getPoems = async (): Promise<Poem[]> => {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching poems:', error);
    return [];
  }
  
  return data as Poem[];
};

export const getPoemById = async (id: string): Promise<Poem | undefined> => {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching poem:', error);
    return undefined;
  }
  return data as Poem;
};

export const savePoem = async (poem: Poem): Promise<void> => {
  // Logic Fix:
  // If the ID is a long timestamp string (created by Date.now() in frontend),
  // AND we are inserting, we should REMOVE the ID so Supabase generates a proper BigInt ID.
  // If it's an update (editing an existing poem), the ID will be a real DB ID (usually smaller number or UUID).

  const isNewPoem = poem.id.length > 10; // Simple heuristic: timestamps are long, DB IDs start small

  if (isNewPoem) {
    // Insert New (Exclude ID)
    const { id, ...poemData } = poem;
    const { error } = await supabase
      .from('poems')
      .insert([poemData]);
      
    if (error) throw error;
  } else {
    // Update Existing
    const { error } = await supabase
      .from('poems')
      .update(poem)
      .eq('id', poem.id);

    if (error) throw error;
  }
};

export const deletePoem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('poems')
    .delete()
    .eq('id', id);

  if (error) console.error("Delete error", error);
};

export const toggleLike = async (id: string): Promise<number> => {
  const { data: poem, error: fetchError } = await supabase
    .from('poems')
    .select('likes')
    .eq('id', id)
    .single();
  
  if (fetchError || !poem) return 0;

  const newLikes = (poem.likes || 0) + 1;

  const { error: updateError } = await supabase
    .from('poems')
    .update({ likes: newLikes })
    .eq('id', id);

  if (updateError) return poem.likes;
  
  return newLikes;
};

// Category Management

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data.map((item: any) => item.name);
};

export const addCategory = async (categoryName: string): Promise<boolean> => {
  const categories = await getCategories();
  if (categories.includes(categoryName)) return false;

  const { error } = await supabase
    .from('categories')
    .insert([{ name: categoryName }]);
  
  if (error) console.error("Add category error", error);
  return !error;
};

export const updateCategory = async (oldName: string, newName: string): Promise<boolean> => {
  const { error: catError } = await supabase
    .from('categories')
    .update({ name: newName })
    .eq('name', oldName);
  
  if (catError) return false;

  const { error: poemError } = await supabase
    .from('poems')
    .update({ category: newName })
    .eq('category', oldName);

  return !poemError;
};

export const deleteCategory = async (categoryName: string): Promise<void> => {
  const cats = await getCategories();
  if (!cats.includes('Kategorisiz')) {
     await addCategory('Kategorisiz');
  }

  await supabase
    .from('poems')
    .update({ category: 'Kategorisiz' })
    .eq('category', categoryName);

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('name', categoryName);

  if (error) console.error("Delete category error", error);
};
