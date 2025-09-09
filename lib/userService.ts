import { supabase } from './supabase';

// 更新用户资料的示例函数
export async function updateUserProfile(userId: string, updates: {
  username?: string;
  display_name?: string;
  bio?: string;
  custom_avatar?: string;
  theme_preference?: string;
  preferred_language?: string;
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 获取用户完整资料
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// 更新 auth.users 中的 user_metadata
export async function updateAuthMetadata(updates: {
  full_name?: string;
  avatar_url?: string;
  [key: string]: any;
}) {
  const { data, error } = await supabase.auth.updateUser({
    data: updates // 这会更新 user_metadata
  });

  if (error) throw error;
  return data;
}

// 创建用户名（注册后的额外步骤）
export async function createUsername(userId: string, username: string) {
  // 检查用户名是否已存在
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (existing) {
    throw new Error('Username already taken');
  }

  // 更新用户名
  return updateUserProfile(userId, { username });
}

// 上传自定义头像到 Supabase Storage
export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // 上传到 Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // 获取公共 URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // 更新用户资料
  await updateUserProfile(userId, { custom_avatar: publicUrl });

  return publicUrl;
}