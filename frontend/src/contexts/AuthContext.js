import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import apiService from '../services/api';

// Создаем контекст
const AuthContext = createContext();

// Провайдер контекста
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Проверяем аутентификацию при загрузке компонента
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiService.auth.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция входа
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.auth.login(credentials);
      setUser(response.data);
      enqueueSnackbar('Вы успешно вошли в систему', { variant: 'success' });
      navigate('/dashboard');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка входа';
      enqueueSnackbar(message, { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Функция выхода
  const logout = async () => {
    try {
      setLoading(true);
      await apiService.auth.logout();
      setUser(null);
      enqueueSnackbar('Вы успешно вышли из системы', { variant: 'success' });
      navigate('/login');
    } catch (error) {
      enqueueSnackbar('Ошибка выхода из системы', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};