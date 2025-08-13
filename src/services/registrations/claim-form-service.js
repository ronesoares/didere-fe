import axiosInstance from '../../lib/axios';

const claimFormService = {
  submitForm: (data) => {
    return axiosInstance.post('/api/claim-form', data);
  }
};

export default claimFormService;
