import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
  }
});

// Добавляем интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибок здесь (например, логирование или показ уведомлений)
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

// API методы для работы с бэкендом
const apiService = {
  // Звонки
  calls: {
    // Получить список звонков
    getAll: (params) => api.get('/calls', { params }),
    // Получить детали звонка
    getById: (id) => api.get(`/calls/${id}`),
    // Создать новый звонок
    create: (data) => api.post('/calls', data),
    // Обновить звонок
    update: (id, data) => api.put(`/calls/${id}`, data),
    // Удалить звонок
    delete: (id) => api.delete(`/calls/${id}`),
  },
  
  // Аутентификация
  auth: {
    // Войти в систему
    login: (credentials) => api.post('/auth/login', credentials),
    // Выйти из системы
    logout: () => api.post('/auth/logout'),
    // Получить текущего пользователя
    getCurrentUser: () => api.get('/auth/me'),
  },
  
  // Статистика
  stats: {
    // Получить общую статистику
    getSummary: () => api.get('/stats/summary'),
    // Получить детальную статистику
    getDetailed: (params) => api.get('/stats/detailed', { params }),
  },
  
  // Настройки
  settings: {
    // Получить настройки
    get: () => api.get('/settings'),
    // Обновить настройки
    update: (data) => api.put('/settings', data),
  },
};

export default apiService;