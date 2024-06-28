'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Google from './google.jpeg';

export default function SignInPage() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleToggleMode = () => {
    setIsCreatingAccount((prev) => !prev);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignIn = async () => {
    if (!validateEmail(formData.email)) {
      setError('Invalid email format');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    const url = isCreatingAccount ? 'http://localhost:4000/users/signup' : 'http://localhost:4000/users/login';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        if (isCreatingAccount) {
          setIsCreatingAccount(false);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('isSeller');
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('isSeller', data.isSeller);

          if (data.isSeller === true) {
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md p-4 border border-gray-300 rounded-md">
        <h2 className="text-2xl font-semibold mb-4">
          {isCreatingAccount ? 'Create Account' : 'Sign In'}
        </h2>

        {isCreatingAccount && (
          <div className="mb-4">
            <label className="block mb-2">User name:</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Enter your username"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            name="password"
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4 w-full"
          onClick={handleSignIn}
        >
          {isCreatingAccount ? 'Create Account' : 'Sign In'}
        </button>

        <div className="flex justify-between items-center">
          <span>
            {isCreatingAccount ? "Already have an account? " : "Don't have an account? "}
            <span className="text-blue-500 cursor-pointer" onClick={handleToggleMode}>
              {isCreatingAccount ? "Sign In" : "Create one"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
