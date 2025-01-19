'use client'
import { Box, Textarea, Button, Flex, useColorModeValue } from '@chakra-ui/react'
import { FaImage } from 'react-icons/fa'

const PostCreator = ({ newPost, setNewPost, fileInputRef, createPost }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  
  return (
    <Box bg={bgColor} p={6} rounded="xl" shadow="lg">
      <Textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Share your market insights, tips, or success stories..."
        mb={4}
      />
      <Flex justify="space-between">
        <Button
          leftIcon={<FaImage />}
          onClick={() => fileInputRef.current.click()}
        >
          Add Property Image
        </Button>
        <Button colorScheme="blue" onClick={createPost}>
          Share Insight
        </Button>
      </Flex>
    </Box>
  )
}

export default PostCreator
