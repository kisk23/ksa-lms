'use client';

import type { IUser } from '@lms/shared-types';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Check for existing session/token
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement login
  };

  const logout = async () => {
    setUser(null);
    // TODO: Clear tokens
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    // TODO: Implement register
  };

  return { user, isLoading, login, logout, register, isAuthenticated: !!user };
}
