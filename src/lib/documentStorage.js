import { supabase } from '@/lib/supabase/client'


export const uploadDocument = async (file, clientId) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${clientId}/${fileName}`

  const { data, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  return { filePath, fileName }
}

export const deleteDocument = async (filePath) => {
  const { error } = await supabase.storage
    .from('documents')
    .remove([filePath])

  if (error) throw error
}

export const getDocumentUrl = async (filePath) => {
  const { data } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 3600) // 1 hour expiry

  return data.signedUrl
}
