// frontend/src/axios-config.js
import axios from 'axios';

// Add a request interceptor to include CSRF token
axios.interceptors.request.use(
  config => {
    const cookies = document.cookie.split(';');
    const csrfToken = cookies
      .find(cookie => cookie.trim().startsWith('csrftoken='))
      ?.split('=')[1];
    
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add this to your index.js or App.js
import './axios-config';