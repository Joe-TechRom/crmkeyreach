'use client'
import { supabase } from '@/lib/supabase/client'

import { useEffect, useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  useColorModeValue,
  Progress,
  Grid,
  Badge,
  useToast
} from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import { FiFile, FiDownload, FiTrash2, FiUpload } from 'react-icons/fi'
import { supabase } from '@/lib/supabaseClient'
import { formatFileSize, validateFile } from '@/utils/fileHelpers'

export default function DocumentManager({ clientId }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const toast = useToast()
  
  const dropzoneBg = useColorModeValue('gray.50', 'gray.700')
  const fileBg = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    fetchDocuments()
    const subscription = setupDocumentSubscription()
    return () => subscription.unsubscribe()
  }, [clientId])

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (data) setFiles(data)
  }

  const setupDocumentSubscription = () => {
    return supabase
      .channel(`documents-${clientId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'documents',
          filter: `client_id=eq.${clientId}`
        }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            setFiles(prev => [payload.new, ...prev])
          }
          if (payload.eventType === 'DELETE') {
            setFiles(prev => prev.filter(file => file.id !== payload.old.id))
          }
        }
      )
      .subscribe()
  }

  const uploadDocument = async (file, clientId) => {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${clientId}/${fileName}`

    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (error) throw error
    return { filePath, fileName }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setUploading(true)
      let uploadedCount = 0

      for (const file of acceptedFiles) {
        try {
          validateFile(file)
          const { filePath, fileName } = await uploadDocument(file, clientId)

          const { error: dbError } = await supabase
            .from('documents')
            .insert([{
              client_id: clientId,
              name: fileName,
              size: file.size,
              type: file.type,
              path: filePath
            }])

          if (dbError) throw dbError

          uploadedCount++
          setProgress((uploadedCount / acceptedFiles.length) * 100)

        } catch (error) {
          toast({
            title: 'Error uploading file',
            description: error.message,
            status: 'error',
            duration: 5000
          })
        }
      }

      setUploading(false)
      setProgress(0)
    }
  })

  const handleDownload = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(file.path, 60)

      if (error) throw error
      window.open(data.signedUrl, '_blank')
    } catch (error) {
      toast({
        title: 'Error downloading file',
        description: error.message,
        status: 'error',
        duration: 5000
      })
    }
  }

  const handleFileDelete = async (fileId, filePath) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath])

      if (storageError) throw storageError

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', fileId)

      if (dbError) throw dbError

      toast({
        title: 'File deleted successfully',
        status: 'success',
        duration: 3000
      })
    } catch (error) {
      toast({
        title: 'Error deleting file',
        description: error.message,
        status: 'error',
        duration: 5000
      })
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box
        {...getRootProps()}
        p={10}
        bg={dropzoneBg}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.500' : 'gray.300'}
        rounded="lg"
        textAlign="center"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ borderColor: 'blue.500' }}
      >
        <input {...getInputProps()} />
        <Icon as={FiUpload} w={8} h={8} color="blue.500" mb={4} />
        <Text fontWeight="medium">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select'}
        </Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          Support for PDF, Word, Excel, and image files
        </Text>
      </Box>

      {uploading && (
        <Box>
          <Progress value={progress} size="sm" colorScheme="blue" rounded="full" />
          <Text fontSize="sm" mt={2} textAlign="center">
            Uploading... {progress}%
          </Text>
        </Box>
      )}

      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {files.map((file) => (
          <Box
            key={file.id}
            p={4}
            bg={fileBg}
            rounded="lg"
            shadow="md"
            transition="all 0.2s"
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
          >
            <HStack justify="space-between" mb={2}>
              <Icon as={FiFile} w={6} h={6} color="blue.500" />
              <Badge colorScheme="blue">{file.type.split('/')[1]}</Badge>
            </HStack>
            
            <Text fontWeight="medium" noOfLines={1}>{file.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(file.created_at).toLocaleDateString()}
            </Text>

            <HStack mt={4} spacing={2}>
              <Button
                size="sm"
                leftIcon={<FiDownload />}
                variant="ghost"
                colorScheme="blue"
                onClick={() => handleDownload(file)}
              >
                Download
              </Button>
              <Button
                size="sm"
                leftIcon={<FiTrash2 />}
                variant="ghost"
                colorScheme="red"
                onClick={() => handleFileDelete(file.id, file.path)}
              >
                Delete
              </Button>
            </HStack>
          </Box>
        ))}
      </Grid>
    </VStack>
  )
}
