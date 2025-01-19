'use client'
import { Button } from '@chakra-ui/react'

const ConnectButton = ({ userId }) => {
  const handleConnect = async (userId) => {
    // Add connection logic here
    console.log('Connecting with user:', userId)
  }

  return (
    <Button
      size="sm"
      colorScheme="linkedin"
      onClick={() => handleConnect(userId)}
    >
      Connect
    </Button>
  )
}

export default ConnectButton
