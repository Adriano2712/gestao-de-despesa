import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getToken, setToken as persistToken } from '../api/client';
import { loginRequest, registerRequest, fetchMe, updateSalaryRequest } from '../api/auth';
import { AuthContext } from './AuthContextBase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => {
        persistToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user: loggedUser } = await loginRequest(credentials);
    persistToken(token);
    setUser(loggedUser);
  }, []);

  const register = useCallback(async (data) => {
    const { token, user: newUser } = await registerRequest(data);
    persistToken(token);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
  }, []);

  const updateSalary = useCallback(async (salary) => {
    const updated = await updateSalaryRequest(salary);
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateSalary }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
