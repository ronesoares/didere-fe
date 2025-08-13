import axiosInstance from '../../lib/axios';

class FilesService {
  async upload(file, idModule, idKeyModule) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('idModule', idModule);
      formData.append('idKeyModule', idKeyModule);

      const response = await axiosInstance.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao fazer upload do arquivo'
      );
    }
  }

  async getById(id) {
    try {
      const response = await axiosInstance.get(`/files/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar arquivo'
      );
    }
  }

  async getBase64(id, thumbnail = false) {
    try {
      const params = thumbnail ? '?thumbnail=true' : '';
      const response = await axiosInstance.get(`/files/${id}/base64${params}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar arquivo em base64'
      );
    }
  }

  async getAll(page = 0, limit = 10) {
    try {
      const response = await axiosInstance.get('/files', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar arquivos'
      );
    }
  }

  async update(id, fileData) {
    try {
      const response = await axiosInstance.put(`/files/${id}`, fileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao atualizar arquivo'
      );
    }
  }

  async delete(id) {
    try {
      const response = await axiosInstance.delete(`/files/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao excluir arquivo'
      );
    }
  }

  async getByModule(idModule, idKeyModule) {
    try {
      const response = await axiosInstance.get('/files', {
        params: { idModule, idKeyModule }
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar arquivos do módulo'
      );
    }
  }

  getFileUrl(id, thumbnail = false) {
    const params = thumbnail ? '?thumbnail=true' : '';
    return `${axiosInstance.defaults.baseURL}/files/${id}/base64${params}`;
  }

  isImage(mimeType) {
    return mimeType && mimeType.startsWith('image/');
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default new FilesService();

