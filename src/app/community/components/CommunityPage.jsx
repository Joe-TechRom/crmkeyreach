'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Textarea,
  Avatar,
  Flex,
  useColorModeValue,
  Image,
  IconButton,
  Input,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaFacebook, FaHeart, FaComment, FaShare, FaImage } from 'react-icons/fa';
import { createBrowserClient } from '@/lib/supabaseClient';
import { signInWithFacebook } from '@/lib/supabaseClient';
import PostCreator from './PostCreator';
import ConnectButton from './ConnectButton';
import Engagement from './Engagement';
import Discussion from './Discussion';

const COMMUNITY_DATA = {
  name: 'KeyReach Real Estate Community',
  coverImage: '/images/real-estate-cover.jpg',
  profileImage: '/images/keyreach-logo.png',
  description:
    'A thriving community of real estate professionals sharing insights and opportunities',
  members: '2.5K members',
  posts: '150+ posts per day',
};

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handleLike = async () => {
    setIsLiked(!isLiked);
  };

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      bg={bgColor}
      p={6}
      rounded="xl"
      shadow="lg"
      mb={6}
    >
      <Flex align="center" mb={4}>
        <Avatar src={post.user_avatar} mr={4} />
        <Box>
          <Text fontWeight="bold">{post.user_name}</Text>
          <Text fontSize="sm" color={textColor}>
            {new Date(post.created_at).toLocaleString()}
          </Text>
        </Box>
      </Flex>
      <Text mb={4}>{post.content}</Text>
      {post.image_url && (
        <Image
          src={post.image_url}
          alt="Post Image"
          borderRadius="md"
          mb={4}
          objectFit="cover"
          width="100%"
          height="auto"
          maxHeight="400px"
        />
      )}
      <Flex justify="space-between">
        <IconButton
          icon={<FaHeart />}
          variant="ghost"
          colorScheme={isLiked ? 'red' : 'gray'}
          aria-label="Like"
          onClick={handleLike}
        />
        <IconButton
          icon={<FaComment />}
          variant="ghost"
          colorScheme="blue"
          aria-label="Comment"
          onClick={() => setShowComments(!showComments)}
        />
        <IconButton
          icon={<FaShare />}
          variant="ghost"
          colorScheme="green"
          aria-label="Share"
        />
      </Flex>
      {showComments && (
        <Box mt={4}>
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            mb={2}
          />
          <Button colorScheme="blue" size="sm">
            Comment
          </Button>
        </Box>
      )}
    </Box>
  );
};

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState({});
  const fileInputRef = useRef(null);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const [supabase] = useState(() => createBrowserClient());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          await fetchPosts();
        } else {
          setUser(null);
        }
      }
    );

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await fetchPosts();
      }
    };

    initializeAuth();
    setupRealtime();

    return () => subscription.unsubscribe();
  }, [supabase]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return;
    }
    if (data) setPosts(data);
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleLogin = async () => {
    const { data, error } = await signInWithFacebook();
    
    if (error) {
      toast({
        title: 'Facebook Login Failed',
        description: error.message || 'Could not sign in with Facebook.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Login Successful',
      description: 'Welcome to KeyReach Community!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleImageUpload = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      toast({
        title: 'Image Upload Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('post-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const createPost = async () => {
    if (!newPost.trim() && !image) return;

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await handleImageUpload(image);
        if (!imageUrl) return;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content: newPost,
            image_url: imageUrl,
            user_id: user?.id,
            user_name: user?.user_metadata?.full_name,
            user_avatar: user?.user_metadata?.avatar_url,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPosts(prevPosts => [data, ...prevPosts]);
      setNewPost('');
      setImage(null);

      toast({
        title: 'Post created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating post',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleJoinCommunity = async () => {
    if (!user) {
      await handleLogin();
    }
  };

  return (
    <Box pt={{ base: 24, md: 32 }}>
      <Container maxW="6xl" py={20}>
        <Box mb={8}>
          <Box
            h="300px"
            position="relative"
            bgImage={COMMUNITY_DATA.coverImage}
            bgSize="cover"
            bgPosition="center"
            rounded="xl"
            overflow="hidden"
          >
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              h="50%"
              bgGradient="linear(to-t, blackAlpha.600, transparent)"
            />
          </Box>
          <Box
            bg={bgColor}
            rounded="xl"
            shadow="lg"
            mt="-75px"
            mx={4}
            position="relative"
            p={6}
          >
            <Flex align="flex-end" mb={6}>
              <Image
                src={COMMUNITY_DATA.profileImage}
                alt="Community Profile"
                w="150px"
                h="150px"
                rounded="full"
                border="4px solid white"
                mt="-100px"
                mr={6}
                objectFit="cover"
              />
              <Box flex={1}>
                <Heading size="xl" mb={2}>
                  {COMMUNITY_DATA.name}
                </Heading>
                <Text color={textColor}>{COMMUNITY_DATA.description}</Text>
              </Box>
            </Flex>
            <Flex justify="space-between" align="center">
              <Stack direction="row" spacing={6}>
                <Text fontWeight="bold">{COMMUNITY_DATA.members}</Text>
                <Text fontWeight="bold">{COMMUNITY_DATA.posts}</Text>
              </Stack>
              <Button colorScheme="blue" size="lg" onClick={handleJoinCommunity}>
                {user ? 'Joined' : 'Join Community'}
              </Button>
            </Flex>
            <Box mt={6}>
              <PostCreator
                newPost={newPost}
                setNewPost={setNewPost}
                fileInputRef={fileInputRef}
                createPost={createPost}
              />
              <Engagement post={post} />
              <Discussion postId={post.id} />
              <ConnectButton userId={post.user_id} />
            </Box>
          </Box>
        </Box>

        <Stack spacing={8}>
          {!user ? (
            <Button
              leftIcon={<FaFacebook />}
              size="lg"
              onClick={handleLogin}
              bg="facebook.500"
              color="white"
              _hover={{ bg: 'facebook.600' }}
            >
              Login with Facebook
            </Button>
          ) : (
            <Stack spacing={6}>
              <Box bg={bgColor} p={6} rounded="xl" shadow="lg">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts..."
                  mb={4}
                />
                <Flex justify="space-between">
                  <Button
                    leftIcon={<FaImage />}
                    onClick={() => fileInputRef.current.click()}
                  >
                    Add Image
                  </Button>
                  <Button colorScheme="blue" onClick={createPost}>
                    Post
                  </Button>
                </Flex>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                />
              </Box>
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default CommunityPage;
