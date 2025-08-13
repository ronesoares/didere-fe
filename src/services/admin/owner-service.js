import axios from '../../lib/axios';

class OwnerService {  
  getAll = (searchTerm, orderBy, pageNumber, pageSize, paginated) => new Promise((resolve, reject) => {
    axios.get(`/owner?request.pageNumber=${pageNumber}&request.pageSize=${pageSize}&request.orderBy=${orderBy}&request.searchTerm=${searchTerm}&request.paginated=${paginated}`)
      .then((response) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  })

  getById = (id) => {

    return axios.get(`/owner/${id}`)
      .then((response) => {
        if (response.data) {
          
          return response.data[0];
        };
      })
      .catch((error) => {
        return Promise.reject(error)
      });
  };

  insert = (request) => new Promise((resolve, reject) => {
    axios.post('/owner', request)
      .then((response) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  })

  update = (request) => {
    return axios.put('/owner', request);
  }

  DeleteById = (id) => new Promise((resolve, reject) => {
    axios.delete(`/owner/${id}`)
      .then((response) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  })
}

const ownerService = new OwnerService();

export default ownerService;
