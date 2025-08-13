import axios from '../../lib/axios';

class LocatorService {
    
  getAll = () => {
    return axios.get(`/locator`)
      .then((response) => {
          return response.data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  getById = (id) => {
    return axios.get(`/locator/${id}`)
    .then((response) => {
      return response.data[0] || null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  };

  insert = (request) => {
    return axios.post('/locator', request);
  };

  update = (request) => {
    return axios.put('/locator', request);
  };

  deleteById = (id) => {
    return axios.delete(`/locator/${id}`);
  };
}

const locatorService = new LocatorService();

export default locatorService;
