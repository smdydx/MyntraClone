
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
import { X, Eye, EyeOff, User, Lock, Mail, Phone } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        title: 'Welcome Back!',
        description: 'You have successfully logged in.',
      });
      onClose();
      resetForm();
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ username, email, password }: { username: string; email: string; password: string }) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
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
        title: 'Welcome to Hednor!',
        description: 'Your account has been created successfully.',
      });
      onClose();
      resetForm();
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.username || !formData.password) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      loginMutation.mutate({ username: formData.username, password: formData.password });
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: 'Password Mismatch',
          description: 'Passwords do not match.',
          variant: 'destructive',
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: 'Weak Password',
          description: 'Password must be at least 6 characters long.',
          variant: 'destructive',
        });
        return;
      }

      registerMutation.mutate({ 
        username: formData.username, 
        email: formData.email, 
        password: formData.password 
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[420px] mx-auto p-0 gap-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
        {/* Header */}
        <DialogHeader className="relative bg-gradient-to-r from-hednor-gold to-yellow-400 p-6 pb-8 text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-hednor-dark" />
          </button>
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-hednor-gold" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-hednor-dark mb-2">
            {isLogin ? 'Welcome Back!' : 'Join Hednor'}
          </DialogTitle>
          <p className="text-hednor-dark/80 text-sm">
            {isLogin ? 'Sign in to continue shopping' : 'Create your account to get started'}
          </p>
        </DialogHeader>

        {/* Form Content */}
        <div className="p-6 pt-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-hednor-gold" />
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                  className="h-12 pl-4 pr-4 text-base border-2 border-gray-200 rounded-xl focus:border-hednor-gold focus:ring-hednor-gold/20 transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Email Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-hednor-gold" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required={!isLogin}
                    className="h-12 pl-4 pr-4 text-base border-2 border-gray-200 rounded-xl focus:border-hednor-gold focus:ring-hednor-gold/20 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}

            {/* Phone Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-hednor-gold" />
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-12 pl-4 pr-4 text-base border-2 border-gray-200 rounded-xl focus:border-hednor-gold focus:ring-hednor-gold/20 transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-hednor-gold" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="h-12 pl-4 pr-12 text-base border-2 border-gray-200 rounded-xl focus:border-hednor-gold focus:ring-hednor-gold/20 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-hednor-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-hednor-gold" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required={!isLogin}
                    className="h-12 pl-4 pr-12 text-base border-2 border-gray-200 rounded-xl focus:border-hednor-gold focus:ring-hednor-gold/20 transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-hednor-gold transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              disabled={isLogin ? loginMutation.isPending : registerMutation.isPending}
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-hednor-gold to-yellow-400 hover:from-yellow-400 hover:to-hednor-gold text-hednor-dark rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {isLogin ? 
                (loginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-hednor-dark/30 border-t-hednor-dark rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : 'Sign In') : 
                (registerMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-hednor-dark/30 border-t-hednor-dark rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : 'Create Account')
              }
            </Button>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-hednor-gold hover:text-yellow-600 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-gray-50 p-6 pt-4 pb-6 border-t border-gray-100">
          <div className="w-full text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            </div>
            <Button 
              type="button"
              variant="outline" 
              onClick={toggleAuthMode} 
              className="w-full h-11 border-2 border-hednor-gold text-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark font-semibold rounded-xl transition-all duration-300"
            >
              {isLogin ? 'Create New Account' : 'Sign In Instead'}
            </Button>
            
            {/* Terms and Privacy (Register only) */}
            {!isLogin && (
              <p className="text-xs text-gray-500 leading-relaxed px-4">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-hednor-gold hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-hednor-gold hover:underline">Privacy Policy</a>
              </p>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
