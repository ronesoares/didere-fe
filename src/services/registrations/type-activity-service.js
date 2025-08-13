import axios from '../../lib/axios';

class TypeActivityService {
    
  getAll = () => {
    return axios.get(`/type-activity`,)
      .then((response) => {
          return response.data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  getById = (id) => {
    return axios.get(`/type-activity/${id}`)
    .then((response) => {
      return response.data[0] || null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  };

  insert = (request) => {
    return axios.post('/type-activity', request);
  };

  update = (request) => {
    return axios.put('/type-activity', request);
  };

  deleteById = (id) => {
    return axios.delete(`/type-activity/${id}`);
  };
}

const typeActivityService = new TypeActivityService();

export default typeActivityService;
