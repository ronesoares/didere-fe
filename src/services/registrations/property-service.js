import axios from '../../lib/axios';

class PropertyService {
    
  getAll = (request) => {
    return axios.post(`/property/search`, request)
      .then((response) => {
          return response.data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  getById = (id) => {
    return axios.get(`/property/${id}`)
    .then((response) => {
      return response.data[0] || null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  };

  insert = (request) => {
    return axios.post('/property', request);
  };

  update = (request) => {
    return axios.put('/property', request);
  };

  deleteById = (id) => {
    return axios.delete(`/property/${id}`);
  };

  uploadPhoto(formData){
    return axios.post("/property/photos/upload", formData, {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    });
  };

  uploadDocument(formData){
    return axios.post("/property/documents/upload", formData, {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    });
  };

  deletePhoto(id) {
    return axios.delete(`/property/photos/${id}`);
  };

  deleteDocument(id) {
    return axios.delete(`/property/documents/${id}`);
  };
}

const propertyService = new PropertyService();

export default propertyService;
