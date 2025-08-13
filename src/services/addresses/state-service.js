import axios from '../../lib/axios';
import authorizationService from '../auth/authorization-service';

class StateService {
  listWithCities = (searchTerm, orderBy, pageNumber, pageSize) => new Promise((resolve, reject) => {
    axios.get(`/states-with-cities?request.pageNumber=${pageNumber}&request.pageSize=${pageSize}&request.orderBy=${orderBy}&request.searchTerm=${searchTerm}`)
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

  refreshStatesAndCities = (async () => {
    try {
      this.listWithCities('', 'name asc', 0, 100000).then((result) => {
        authorizationService.setStatesAndCities(result);
      });
    } catch (err) {
      console.error(err);
    }
  });
}

const stateService = new StateService();

export default stateService;
