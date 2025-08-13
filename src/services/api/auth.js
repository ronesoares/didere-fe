import axiosInstance from '../../lib/axios';

class AuthService {
  async login(email, password) {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { access_token, user } = response.data;

      if (access_token) {
        localStorage.setItem('accessToken', access_token);
      }

      return { user, token: access_token };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao fazer login'
      );
    }
  }

  async register(userData) {
    try {
      const response = await axiosInstance.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao criar conta'
      );
    }
  }

  async getProfile() {
    try {
      const response = await axiosInstance.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar perfil'
      );
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await axiosInstance.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao atualizar perfil'
      );
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await axiosInstance.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao alterar senha'
      );
    }
  }

  async forgotPassword(email) {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao solicitar recuperação de senha'
      );
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao redefinir senha'
      );
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }
}

export default new AuthService();

