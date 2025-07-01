import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Spacer,
  Box,
  Text
} from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER } from '../graphql/mutations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const [loginUser, { loading: loginLoading }] = useMutation(LOGIN_USER, {
    onCompleted(data) {
      localStorage.setItem('token', data.login.token);
      toast({
        title: 'Login Successful',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      window.location.reload(); // Refresh the page to update the user context
    },
    onError(error) {
      toast({
        title: 'Login Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const [registerUser, { loading: registerLoading }] = useMutation(REGISTER_USER, {
    onCompleted(data) {
      localStorage.setItem('token', data.register.token);
      toast({
        title: 'Registration Successful',
        description: 'You have successfully registered.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      window.location.reload(); // Refresh the page to update the user context
    },
    onError(error) {
      toast({
        title: 'Registration Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      loginUser({ variables: { username, password } });
    } else {
      registerUser({ variables: { username, password } });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isLogin ? 'Login' : 'Register'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <Button
              isLoading={isLogin ? loginLoading : registerLoading}
              mt={4}
              colorScheme="blue"
              type="submit"
              width="100%"
            >
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
        </ModalBody>

        <ModalFooter>
          <Flex>
            <Box>
              <Text>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
            </Box>
            <Spacer />
            <Button colorScheme="gray" onClick={toggleAuthMode}>
              {isLogin ? 'Register' : 'Login'}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;