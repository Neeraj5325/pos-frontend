import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    const user = useAuthStore.getState().user;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (user?.tenant?.slug) {
        config.headers['x-tenant-id'] = user.tenant.slug;
    }

    return config;
});

export default api;
