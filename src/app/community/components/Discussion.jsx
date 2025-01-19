'use client'
import { Box, Heading, Input, Button } from '@chakra-ui/react'

const Discussion = ({ postId }) => {
  const handleAddComment = async (postId) => {
    // Add comment logic here
    console.log('Adding comment to post:', postId)
  }

  return (
    <Box mt={4}>
      <Heading size="sm" mb={2}>Discussion</Heading>
      <Input placeholder="Add to the discussion..." />
      <Button mt={2} colorScheme="blue" onClick={() => handleAddComment(postId)}>
        Comment
      </Button>
    </Box>
  )
}

export default Discussion
