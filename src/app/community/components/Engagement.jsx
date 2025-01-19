'use client'
import { Flex, Button } from '@chakra-ui/react'
import { FaHeart, FaComment, FaShare } from 'react-icons/fa'

const Engagement = ({ post }) => {
  const handleLike = (postId) => {
    console.log('Liking post:', postId)
  }

  const handleComment = (postId) => {
    console.log('Commenting on post:', postId)
  }

  const handleShare = (postId) => {
    console.log('Sharing post:', postId)
  }

  return (
    <Flex mt={4} justify="space-between">
      <Button variant="ghost" leftIcon={<FaHeart />} onClick={() => handleLike(post.id)}>
        Like
      </Button>
      <Button variant="ghost" leftIcon={<FaComment />} onClick={() => handleComment(post.id)}>
        Comment
      </Button>
      <Button variant="ghost" leftIcon={<FaShare />} onClick={() => handleShare(post.id)}>
        Share
      </Button>
    </Flex>
  )
}

export default Engagement
