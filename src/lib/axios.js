import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://app.didere.chiste.systems/api',
    // baseURL: 'https://localhost:62870/api',
    timeout: 20000,
    headers: {
        'accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use((response) => response,
  (error) => {
    return Promise.reject((error && error.response && error.response.data) || 'Algo está errado, tente novamente mais tarde'); 
  });

axiosInstance.interceptors.request.use(function (config) {
  let access_token = localStorage.getItem('accessToken');
    
  if(access_token){
      config.headers.Authorization = access_token;
  };

  return config;
});

export default axiosInstance;