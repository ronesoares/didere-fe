import axios from '../../lib/axios';

class FeatureService {
    
  getAll = () => {
    return axios.get(`/feature`)
      .then((response) => {
          return response.data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  getById = (id) => {
    return axios.get(`/feature/${id}`)
    .then((response) => {
      return response.data[0] || null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  };

  insert = (request) => {
    return axios.post('/feature', request);
  };

  update = (request) => {
    return axios.put('/feature', request);
  };

  deleteById = (id) => {
    return axios.delete(`/feature/${id}`);
  };
}

const featureService = new FeatureService();

export default featureService;
