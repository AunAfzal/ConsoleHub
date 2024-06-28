"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:4000/users/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          });

          const data = await response.json();

          if (response.ok) {
            const isSeller = localStorage.getItem('isSeller') === 'true'; // Properly parse boolean
            if (isSeller) {
              setIsLoggedIn(true);
            } else {
              console.error('User is not a seller.');
              setIsLoggedIn(false);
            }
          } else {
            console.error('Token verification failed:', data.message);
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false); // Set loading to false after verification
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
