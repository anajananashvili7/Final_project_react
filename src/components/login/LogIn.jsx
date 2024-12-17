import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ensure the path is correct

const JoinCommunity = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Custom hook for managing auth context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (email && password) {
      try {
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          const { access_token } = data;

          // Save the token to localStorage
          localStorage.setItem('accessToken', access_token);

          // Store user info in context for a better app experience
          login({ email });

          setSuccessMessage('Login successful! Redirecting...');
          setTimeout(() => navigate('/'), 2000); // Navigate to home/dashboard
        } else {
          setError(data.message || 'Invalid email or password.');
        }
      } catch (err) {
        setError('An error occurred during login. Please try again.');
        console.error('Login error:', err);
      }
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4 p-6 w-96">
        <h2 className="text-2xl font-bold">Log In</h2>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        {/* Submit Button */}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded w-full">
          Log In
        </button>

        {/* Sign Up Link */}
        <p className="text-blue-600 cursor-pointer" onClick={() => navigate('/sign-up')}>
          Don't have an account? Sign up
        </p>
      </form>
    </div>
  );
};

export default JoinCommunity;
