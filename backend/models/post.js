const supabase = require("../supabase");

// Post oluşturma
async function createPost(userId, content) {
  const { data, error } = await supabase
    .from("posts")
    .insert([{ user_id: userId, content }])
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

// Tüm postları getirme (en son oluşturulana göre sıralı)
async function getAllPosts(limit = 20, offset = 0) {
  const { data, error, count } = await supabase
    .from("posts")
    .select(
      `
      id, 
      content, 
      created_at, 
      likes_count, 
      comments_count,
      users!posts_user_id_fkey (id, name, email)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return { posts: data, count };
}

// Belirli bir kullanıcının postlarını getirme
async function getUserPosts(userId, limit = 20, offset = 0) {
  const { data, error, count } = await supabase
    .from("posts")
    .select(
      `
      id, 
      content, 
      created_at, 
      likes_count, 
      comments_count,
      users!posts_user_id_fkey (id, name, email)
    `,
      { count: "exact" }
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return { posts: data, count };
}

// Bir postu ID'ye göre getirme
async function getPostById(postId) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id, 
      content, 
      created_at, 
      likes_count, 
      comments_count,
      users!posts_user_id_fkey (id, name, email)
    `
    )
    .eq("id", postId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Bir postu güncelleme
async function updatePost(postId, content) {
  const { data, error } = await supabase
    .from("posts")
    .update({ content, updated_at: new Date() })
    .eq("id", postId)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

// Bir postu silme
async function deletePost(postId) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
};
