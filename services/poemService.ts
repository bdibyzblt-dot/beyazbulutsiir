
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
  const isFrontendId = poem.id.length > 10; 

  if (isFrontendId) {
    const { id, ...poemData } = poem;
    const { error } = await supabase
      .from('poems')
      .insert([poemData]);
    if (error) throw error;
  } else {
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

// --- Gelişmiş Beğeni Sistemi ---
export const toggleLike = async (poemId: string): Promise<number> => {
  // 1. Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    alert("Beğenmek için giriş yapmalısınız.");
    // Return current count without changing
    const { data } = await supabase.from('poems').select('likes').eq('id', poemId).single();
    return data?.likes || 0;
  }

  // 2. Check if already liked
  const { data: existingLike } = await supabase
    .from('poem_likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('poem_id', poemId)
    .maybeSingle();

  if (existingLike) {
    // UNLIKE: Remove from poem_likes
    await supabase.from('poem_likes').delete().eq('user_id', user.id).eq('poem_id', poemId);
  } else {
    // LIKE: Insert into poem_likes
    await supabase.from('poem_likes').insert([{ user_id: user.id, poem_id: poemId }]);
  }

  // 3. Recalculate total likes from table
  const { count } = await supabase
    .from('poem_likes')
    .select('*', { count: 'exact', head: true })
    .eq('poem_id', poemId);
  
  const newCount = count || 0;

  // 4. Update the poems table cache for display performance
  await supabase
    .from('poems')
    .update({ likes: newCount })
    .eq('id', poemId);
  
  return newCount;
};

// Check if current user liked a poem
export const checkIsLiked = async (poemId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('poem_likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('poem_id', poemId)
    .maybeSingle();
  
  return !!data;
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

  await supabase
    .from('poems')
    .update({ category: newName })
    .eq('category', oldName);

  return true;
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
