'use client';

import { useState } from 'react';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call authService.register()
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="register-firstName">First Name</label>
        <input
          id="register-firstName"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          required
        />
      </div>
      <div>
        <label htmlFor="register-lastName">Last Name</label>
        <input
          id="register-lastName"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          required
        />
      </div>
      <div>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
        />
      </div>
      <div>
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          required
          minLength={8}
        />
      </div>
      <button type="submit">Create Account</button>
    </form>
  );
}
