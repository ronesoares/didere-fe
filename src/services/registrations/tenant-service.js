import axios from '../../lib/axios';

class TenantService {
    
  getAll = () => {
    return axios.get(`/tenant`,)
      .then((response) => {
          return response.data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  getById = (id) => {
    return axios.get(`/tenant/${id}`)
    .then((response) => {
      return response.data[0] || null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  };

  insert = (request) => {
    return axios.post('/tenant', request);
  };

  update = (request) => {
    return axios.put('/tenant', request);
  };

  deleteById = (id) => {
    return axios.delete(`/tenant/${id}`);
  };
}

const tenantService = new TenantService();

export default tenantService;
