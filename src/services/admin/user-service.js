import axios from '../../lib/axios';

class UserService {

  sendNewPassword(login){
    return axios.get("/user/send-new-password", { params: { login: login } });
  }

  generateRandomPassword = () => {
    return axios.post("/user/generate-random-password"
    ).then(resp => {
      return resp.data;
    });
  };

  getAll = (orderBy) => {
    return axios.get(`/user/by-owner?request.orderBy=${orderBy}`)
      .then((response) => {
        return response.data || {};
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };

  getById = (id) => {
    return axios.get(`/user/${id}`)
      .then((response) => {
        return response.data[0] || null;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  insert = (request) => {
    return axios.post('/user', request);
  };

  update = (request) => {    
    return axios.put('/user', request);
  };

  deleteById = (id) => {
    return axios.delete(`/user/${id}`);
  };

  validationAfterLogged = (login) => {
    return axios.get(`/user/validation-after-logged?login=${login}`);
  }
}

const userService = new UserService();

export default userService;