import axios from 'axios';
import { showAlert } from './alerts';

// api/v1/users/updatePassword
// type: 'password' or 'user'
export const updateSettings = async (data, type) => {
    try {
        const url = type === 'password'
            ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
            : 'http://127.0.0.1:3000/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', `Changed ${type} data in successfully`);
            window.setTimeout(() => {
                location.reload(true);
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

