import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Login failed, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const formStyle = {
    maxWidth: '350px',
    margin: '5rem auto',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#f7f7f7',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.7rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#2980b9',
  };

  const errorStyle = {
    color: 'red',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>

      <div>
        <label htmlFor="username" style={labelStyle}>Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="password" style={labelStyle}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          ...buttonStyle,
          ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {error && <p style={errorStyle}>{error}</p>}
    </form>
  );
};

export default LoginForm;
