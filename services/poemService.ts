
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
  // If ID is very long (timestamp string from frontend) -> It's NEW -> Insert without ID
  // If ID is short/number (from DB) -> It's EXISTING -> Update with ID
  
  // We check if the ID looks like a timestamp (e.g., "1709..." which is 13 chars)
  const isFrontendId = poem.id.length > 10; 

  if (isFrontendId) {
    // INSERT NEW: We MUST remove the 'id' field so Supabase auto-generates it.
    const { id, ...poemData } = poem;
    
    const { error } = await supabase
      .from('poems')
      .insert([poemData]);
      
    if (error) {
        console.error("Insert Error:", error);
        throw error;
    }
  } else {
    // UPDATE EXISTING
    const { error } = await supabase
      .from('poems')
      .update({
          title: poem.title,
          content: poem.content,
          author: poem.author,
          category: poem.category,
          date: poem.date,
          likes: poem.likes
      })
      .eq('id', poem.id);

    if (error) {
        console.error("Update Error:", error);
        throw error;
    }
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
  // Ensure fallback category exists
  const cats = await getCategories();
  if (!cats.includes('Kategorisiz')) {
     await addCategory('Kategorisiz');
  }

  // Move poems
  await supabase
    .from('poems')
    .update({ category: 'Kategorisiz' })
    .eq('category', categoryName);

  // Delete category
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('name', categoryName);

  if (error) console.error("Delete category error", error);
};
