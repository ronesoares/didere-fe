import axios from '../../lib/axios';

class ClaimFormService {
    
  insert = (request) => {
    return axios.post('/claim-form', request);
  };
}

const claimFormService = new ClaimFormService();

export default claimFormService;
