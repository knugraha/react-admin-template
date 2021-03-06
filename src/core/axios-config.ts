import axios from 'axios';
import {notification} from 'antd';
import {APP_DEBUG, AUTH_STORAGE_KEY} from './properties';
import {logout} from '../utils/logout';

const {loadProgressBar} = require('axios-progress-bar');

loadProgressBar();

// Add a request interceptor
axios.interceptors.request.use((config) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    config.headers['Authorization'] = localStorage.getItem(AUTH_STORAGE_KEY || '') || '';
    return config;
}, (error) => {
    if (APP_DEBUG) {
        console.log(error);
    }
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use((response) => {
    // Do something with response data
    return response.data;
}, (e) => {
    const error = e.response;
    if (error.status === 401) {
        notification.error({message: 'Thất bại', description: 'Lỗi xác thực hoặc phiên làm việc đã hết hạn.'});
        logout();
    } else if (error.status === 403) {
        notification
            .warning({
                message: 'Thất bại',
                description: 'Bạn không có quyền truy cập tài nguyên này, vui lòng liên hệ admin để được cấp quyền'
            });
    } else if (error.data) {
        notification.error({message: 'Thất bại', description: error.data.message});
    } else {
        notification.error({message: 'Thất bại', description: 'Vui lòng thử lại sau'});
    }
    // message.success('This is a prompt message for success, and it will disappear in 10 seconds', 10)
    return Promise.reject(e);
});
