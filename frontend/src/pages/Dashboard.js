import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import apiService from '../services/api';

// Демо-данные вынесены за пределы компонента
const demoStats = {
  totalCalls: 1254,
  failedCalls: 23,
  successRate: 98.2,
  recentCalls: [
    { id: 1, number: '+7 (123) 456-7890', status: 'success', date: '2023-09-15T10:30:00' },
    { id: 2, number: '+7 (098) 765-4321', status: 'failed', date: '2023-09-15T11:15:00' },
    { id: 3, number: '+7 (111) 222-3333', status: 'success', date: '2023-09-15T12:00:00' }
  ]
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCalls: 0,
    failedCalls: 0,
    successRate: 0,
    recentCalls: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка статистики
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.stats.getSummary();
      
      // Проверяем наличие данных и их структуру
      const newStats = {
        totalCalls: response?.data?.totalCalls ?? 0,
        failedCalls: response?.data?.failedCalls ?? 0,
        successRate: response?.data?.successRate ?? 0,
        recentCalls: Array.isArray(response?.data?.recentCalls) ? response.data.recentCalls : []
      };
      
      setStats(newStats);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Не удалось загрузить статистику');
      // В случае ошибки устанавливаем демо-данные
      setStats(demoStats);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка статистики при монтировании компонента
  useEffect(() => {
    loadStats();
  }, []);

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Убедимся, что у нас всегда есть валидный объект stats
  const safeStats = {
    ...stats,
    recentCalls: Array.isArray(stats?.recentCalls) ? stats.recentCalls : []
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Дашборд
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={loadStats}
          disabled={loading}
        >
          Обновить
        </Button>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.main', color: 'white' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Карточки статистики */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <div>
                  <Typography variant="h6" color="text.secondary">
                    Всего звонков
                  </Typography>
                  <Typography variant="h4">
                    {safeStats.totalCalls}
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ErrorIcon sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
                <div>
                  <Typography variant="h6" color="text.secondary">
                    Неудачных звонков
                  </Typography>
                  <Typography variant="h4">
                    {safeStats.failedCalls}
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                <div>
                  <Typography variant="h6" color="text.secondary">
                    Процент успешных
                  </Typography>
                  <Typography variant="h4">
                    {safeStats.successRate}%
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Недавние звонки */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Недавние звонки
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
              </Box>
            ) : safeStats.recentCalls.length > 0 ? (
              safeStats.recentCalls.map((call) => (
                <Paper 
                  key={call?.id || Math.random()} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: `4px solid ${call?.status === 'success' ? 'green' : 'red'}`
                  }}
                >
                  <div>
                    <Typography variant="subtitle1">{call?.number || 'Неизвестный номер'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {call?.date ? new Date(call.date).toLocaleString() : 'Дата неизвестна'}
                    </Typography>
                  </div>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center', 
                    color: call?.status === 'success' ? 'success.main' : 'error.main' 
                  }}>
                    {call?.status === 'success' 
                      ? <CheckCircleIcon sx={{ mr: 1 }} /> 
                      : <ErrorIcon sx={{ mr: 1 }} />}
                    <Typography>
                      {call?.status === 'success' ? 'Успешно' : 'Ошибка'}
                    </Typography>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ p: 2 }}>
                Нет недавних звонков
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;