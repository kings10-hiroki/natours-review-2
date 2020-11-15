import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Signed up in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const login = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });

        if (res.data.status === 'success') location.reload(true);
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.');
    }
}

