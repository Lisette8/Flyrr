import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';
import { socket } from '../lib/socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authUser) {
      socket.connect();
      socket.emit('userOnline', authUser._id);
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [authUser]);

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get('/auth/checkUserAuth');
      setAuthUser(res.data);
    } catch (error) {
      console.log('Not authenticated');
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    const res = await axiosInstance.post('/auth/signup', userData);
    setAuthUser(res.data);
    return res.data;
  };

  const login = async (credentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    setAuthUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await axiosInstance.post('/auth/logout');
    setAuthUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await axiosInstance.put('/auth/updateProfile', profileData);
    setAuthUser(res.data.updatedUserInstance);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        loading,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
