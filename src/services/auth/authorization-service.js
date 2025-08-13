import axios from '../../lib/axios';
import { decode } from '../../utils/jwt';
import stateService from '../addresses/state-service';

class AuthorizationService {
  setAxiosInterceptors = ({ onLogout }) => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          this.setSession(null);

          if (onLogout) {
            onLogout();
          }
        }

        return Promise.reject(error);
      }
    );
  };

  insertRefreshToken(login, refreshToken, idUser){
    return axios.post("/user/insert-refresh-token", {
      "login": login,
      "refreshToken": refreshToken,
      "idUser": idUser
    });
  };

  handleAuthentication() {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return;
    }

    if (this.isValidToken(accessToken)) {
      this.setSession(accessToken);
    } else {
      this.setSession(null);
    }
  }

  loginWithPassword = (login, password) => {
    const data = ({
      'username': login,
      'password': password
    });

    const headers = {
      'content-type': 'application/json'
    };

    return axios.post('/auth/login', data, { headers: headers })
      .then((response) => {
        if (response.data) {
          this.setSession(response.data.access_token);
          this.setUser(response.data.user);
          stateService.refreshStatesAndCities();
        }

        return response.data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };
   
  loginWithGoogleToken = (login, token, refreshToken, idUser) => {
    const headers = {
      'content-type': 'application/json'
    }

    const data = ({
      'login': login,
      'tokenGoogle': token
    })

    return axios.post('/auth/login-google', data, { headers: headers })
      .then((response) => {
        
        if (response.data) {
          this.setSession(response.data.access_token);
          this.setUser(response.data.user);
          stateService.refreshStatesAndCities();
        }

        this.insertRefreshToken(login, refreshToken, idUser);

        return response.data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  logout = () => {
    this.setSession(null);
    this.setUser(null);
  }

  setSession = (accessToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', `Bearer ${accessToken}`);

      axios.interceptors.request.use((config) => {
        const access_token = localStorage.getItem('accessToken');
    
        if(access_token){
            config.headers.Authorization = access_token;
        };
      
        return config;
      });
    } else {
      localStorage.removeItem('accessToken');
      axios.interceptors.request.eject();
    }
  }

  getAccessToken = () => localStorage.getItem('accessToken');

  setUser = (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  };

  getUser = () => {
    const appUserData = window.localStorage.getItem('user');
    return JSON.parse(appUserData);
  };

  setStatesAndCities = (states) => {
    if (states) {
      localStorage.setItem('states', JSON.stringify(states));
    } else {
      localStorage.removeItem('states');
    }
  };

  getStatesAndCities = () => {
    const cities = window.localStorage.getItem('states');
    return JSON.parse(cities);
  };

  isValidToken = (accessToken) => {
    if (!accessToken) {
      return false;
    }

    const decoded = decode(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  }

  getLoginByToken = (accessToken) => {
    if (!accessToken) {
      return "";
    }

    const decoded = decode(accessToken);

    return decoded.unique_name;
  }

  sendNewPassword = (login) => {
    return axios.post('/user/send-new-password', `${login}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }); 
  }

  getOwnerIdFromUserLogged(){
    const user = this.getUser();

    return user?.idOwner;
  };

  getUserIdFromUserLogged(){
    
    const user = this.getUser();

    return user?.id;
  };

  isAuthenticated = () => !!this.getAccessToken();
}

const authorizationService = new AuthorizationService();

export default authorizationService;
