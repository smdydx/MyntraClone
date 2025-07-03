import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      toast({
        title: 'Login Successful',
        description: 'You have successfully logged in.',
      });
      onClose();
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: 'Login Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      toast({
        title: 'Registration Successful',
        description: 'You have successfully registered.',
      });
      onClose();
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      loginMutation.mutate({ username, password });
    } else {
      registerMutation.mutate({ username, password });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{isLogin ? 'Login' : 'Register'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-11 text-base"
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 text-base"
              placeholder="Enter your password"
            />
          </div>
          <Button
            disabled={isLogin ? loginMutation.isPending : registerMutation.isPending}
            type="submit"
            className="w-full h-11 text-base font-medium"
          >
            {isLogin ? 
              (loginMutation.isPending ? 'Logging in...' : 'Login') : 
              (registerMutation.isPending ? 'Registering...' : 'Register')
            }
          </Button>
        </form>
        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button variant="outline" onClick={toggleAuthMode} className="w-full sm:w-auto">
            {isLogin ? 'Register' : 'Login'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;