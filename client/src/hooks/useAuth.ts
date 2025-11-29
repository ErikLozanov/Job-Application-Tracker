import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, updateProfile, deleteAccount, getUser } from '../api/auth';
import axios from 'axios';

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {

      localStorage.setItem('token', data.token);

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

export const useUpdateProfile = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      localStorage.removeItem('token');
      
      alert('Password updated successfully! Please log in again.');
      
      navigate('/login');
    },
  });
};

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      localStorage.removeItem('token');
      navigate('/');
      alert('Your account has been deleted.');
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
  });
};