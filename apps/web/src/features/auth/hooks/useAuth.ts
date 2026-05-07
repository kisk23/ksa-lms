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

  const login = async (_email: string, _password: string) => {
    // TODO: Implement login
  };

  const logout = async () => {
    setUser(null);
    // TODO: Clear tokens
  };

  const register = async (data: {
    _email: string;
    _password: string;
    _firstName: string;
    _lastName: string;
  }) => {
    // TODO: Implement register
  };

  return { user, isLoading, login, logout, register, isAuthenticated: !!user };
}
