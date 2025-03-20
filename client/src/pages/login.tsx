import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import "../utils/login.css"

import Auth from '../utils/auth';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { input: { email: formState.email, password: formState.password } },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>

        <div>
          {data ? (
            <p>
              Success! You may now head{' '}
              <Link to="/">back to the homepage.</Link>
            </p>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <input
                placeholder="Email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                className="input-field"
              />
              <input
                placeholder="Password"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
                className="input-field"
              />
              <button
                type="submit"
                className="login-button"
                style={{ cursor: 'pointer' }}
              >
                Login
              </button>
            </form>
          )}

          {error && (
            <div>
              <p className="error-message">{error.message}</p>
            </div>
          )}
        </div>
        <p className="register-link">
          Don’t have an account? <Link to="/signup">Register Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
