import axios from '../../lib/axios';
import qs from 'qs';

class ProfileService {
  getAll = (orderBy) => {
    const request = {
      params: {
        'request.OrderBy': orderBy,
      },

      paramsSerializer: params => {
        return qs.stringify(params)
      }
    };

    return axios.get("/profile/by-owner", request)
      .then((response) => {
        return response.data || {};
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };

  getPlusAdministrator = (orderBy) => {
    const request = {
      params: {
        'request.OrderBy': orderBy,
      },

      paramsSerializer: params => {
        return qs.stringify(params)
      }
    };

    return axios.get("/profile/by-owner-plus-administrator", request)
      .then((response) => {
        return response.data || {};
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };

  getById = (id) => {
    return axios.get(`/profile/${id}`)
    .then((response) => {
      return response.data[0] || null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  };

  insert = (request) => {
    return axios.post('/profile', request);
  };

  update = (request) => {
    return axios.put('/profile', request);
  };

  deleteById = (id) => {
    return axios.delete(`/profile/${id}`);
  };
}

const profileService = new ProfileService();

export default profileService;
