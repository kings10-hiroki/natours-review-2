import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout, signup } from './authentication';
import { updateSettings } from './updateSettings';
import { previewFile } from './imageLoader';
import { bookTour } from './stripe';

// DOM
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateUserData = document.querySelector('.form-user-data');
const updatePassword = document.querySelector('.form-user-settings');
const savePasswordBtn = document.querySelector('.btn--save');
const userPhoto = document.getElementById('user-photo');
const fileInput = document.querySelector('.form__upload-image');
const bookBtn = document.getElementById('book-tour');

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    // JSON.stringifyは、JavaScriptオブジェクトをJSONテキストに変換し、そのJSONテキストを文字列に格納します。
    // JSON.parseは、JSONテキストの文字列をJavaScriptオブジェクトに変換します。

    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login({ email, password });
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        signup({ name, email, password, passwordConfirm });
    });
}

if (userPhoto) {
    // <input>でファイルが選択されたときの処理
    const handleFileSelect = () => {
        const files = fileInput.files;
        // 複数枚のアップロードに対応
        for (let i = 0; i < files.length; i++) {
            previewFile(userPhoto, files[i]);
        }
    }
    fileInput.addEventListener('change', handleFileSelect);
}

if (updateUserData) {
    updateUserData.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'user');
    });
}

if (updatePassword) {
    updatePassword.addEventListener('submit', async e => {
        e.preventDefault();
        savePasswordBtn.textContent = 'Updating...';
        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ currentPassword, password, passwordConfirm }, 'password');

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
        savePasswordBtn.textContent = 'Save password';
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing'
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}