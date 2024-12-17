import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (firstName && lastName && email && password && phoneNumber) {
      setError('');
      try {
        const response = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            phone_number: phoneNumber,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Registration successful:', data);
          setSuccessMessage('Registration successful! Redirecting...');
          setTimeout(() => {
            navigate('/join-community'); // Redirect after success
          }, 2000);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Registration failed. Please try again.');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Something went wrong. Please try again later.');
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSignUp} className="flex flex-col items-center space-y-4 p-6 w-96">
        <button className="flex items-center space-x-2 border border-gray-300 rounded p-2 w-full justify-center">
          <img src="/Google.png" alt="Google Icon" className="h-4 w-4" />
          <span>Continue with Google</span>
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <div className="flex flex-col w-full">
          <label className="text-left mb-1 text-[14px] leading-[24px] text-[#003459] font-semibold">First Name</label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-left mb-1 text-[14px] leading-[24px] text-[#003459] font-semibold">Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-left mb-1 text-[14px] leading-[24px] text-[#003459] font-semibold">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-left mb-1 text-[14px] leading-[24px] text-[#003459] font-semibold">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-left mb-1 text-[14px] leading-[24px] text-[#003459] font-semibold">Phone Number</label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <p className="text-[#003459] text-[12px] leading-[24px]">
          By creating an account you agree with our <span className="font-semibold">Terms of Service</span> and{' '}
          <span className="font-semibold">Privacy Policy</span>.
        </p>

        <button type="submit" className="bg-[#003459] text-white py-2 rounded w-full">
          Create Account
        </button>
        <span
          className="text-[#003459] text-[14px] leading-[24px] cursor-pointer"
          onClick={() => navigate('/join-community')}
        >
          Already have an account? Log in
        </span>
      </form>
    </div>
  );
};

export default SignUp;
