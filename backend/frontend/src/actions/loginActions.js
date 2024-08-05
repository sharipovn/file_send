import axios from 'axios';

export const login = async (username, password) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post('/api/login/', { username, password }, config);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    } catch (error) {
        // Extract error message from the response or use a default message
        const errorMessage = error.response?.data?.detail || 'An error occurred. Please try again.';
        throw new Error(errorMessage);
    }
};