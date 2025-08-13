import axiosInstance from '../../lib/axios';

class PropertiesService {
  async searchPublic(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          if (Array.isArray(filters[key])) {
            params.append(key, filters[key].join(','));
          } else {
            params.append(key, filters[key]);
          }
        }
      });

      const response = await axiosInstance.get(`/properties/search/public?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar propriedades'
      );
    }
  }

  async getAll(page = 0, limit = 10) {
    try {
      const response = await axiosInstance.get('/properties', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar propriedades'
      );
    }
  }

  async getById(id) {
    try {
      const response = await axiosInstance.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar propriedade'
      );
    }
  }

  async create(propertyData) {
    try {
      const response = await axiosInstance.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao criar propriedade'
      );
    }
  }

  async update(id, propertyData) {
    try {
      const response = await axiosInstance.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao atualizar propriedade'
      );
    }
  }

  async delete(id) {
    try {
      const response = await axiosInstance.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao excluir propriedade'
      );
    }
  }

  async getFeatures() {
    try {
      const response = await axiosInstance.get('/features');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar características'
      );
    }
  }

  async getTypeActivities() {
    try {
      const response = await axiosInstance.get('/type-activities');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar tipos de atividade'
      );
    }
  }

  async getStates() {
    try {
      const response = await axiosInstance.get('/states');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar estados'
      );
    }
  }

  async getCitiesByState(stateId) {
    try {
      const response = await axiosInstance.get(`/cities?idState=${stateId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar cidades'
      );
    }
  }
}

export default new PropertiesService();

