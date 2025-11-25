import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../api/auth';
import type { AuthError } from '../types';
import axios from 'axios';

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // 1. Save the token to localStorage
      localStorage.setItem('token', data.token);

      // 3. Redirect to the Dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message || error.message);
      } else {
        console.error(error);
      }
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);

      navigate('/dashboard');
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Login Error:", error.response?.data?.message || error.message);
      }
    },
  });
};