import { supabase } from './supabaseClient';
import { Poem, Category } from "../types";

export const getPoems = async (): Promise<Poem[]> => {
  // Order by date descending directly in the database query
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
  // Use upsert for atomic insert/update operation based on 'id'
  const { error } = await supabase
    .from('poems')
    .upsert(poem, { onConflict: 'id' });

  if (error) {
    console.error("Save poem error:", error);
    throw error;
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
  // 1. Get current likes
  const { data: poem, error: fetchError } = await supabase
    .from('poems')
    .select('likes')
    .eq('id', id)
    .single();
  
  if (fetchError || !poem) return 0;

  const newLikes = (poem.likes || 0) + 1;

  // 2. Update likes
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
    // If table is empty or error, return empty array gracefully
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data.map((item: any) => item.name);
};

export const addCategory = async (categoryName: string): Promise<boolean> => {
  // Check existence first to avoid duplicate key errors if not handled by DB
  const categories = await getCategories();
  if (categories.includes(categoryName)) return false;

  const { error } = await supabase
    .from('categories')
    .insert([{ name: categoryName }]);
  
  if (error) console.error("Add category error", error);
  return !error;
};

export const updateCategory = async (oldName: string, newName: string): Promise<boolean> => {
  // 1. Update Category Table
  const { error: catError } = await supabase
    .from('categories')
    .update({ name: newName })
    .eq('name', oldName);
  
  if (catError) {
    console.error("Update category error", catError);
    return false;
  }

  // 2. Update Poems with this category
  const { error: poemError } = await supabase
    .from('poems')
    .update({ category: newName })
    .eq('category', oldName);

  if (poemError) console.error("Update poem category error", poemError);

  return !poemError;
};

export const deleteCategory = async (categoryName: string): Promise<void> => {
  // 1. Ensure 'Kategorisiz' exists for reassignment
  const cats = await getCategories();
  if (!cats.includes('Kategorisiz')) {
     await addCategory('Kategorisiz');
  }

  // 2. Reassign poems to 'Kategorisiz'
  await supabase
    .from('poems')
    .update({ category: 'Kategorisiz' })
    .eq('category', categoryName);

  // 3. Delete from Categories
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('name', categoryName);

  if (error) console.error("Delete category error", error);
};