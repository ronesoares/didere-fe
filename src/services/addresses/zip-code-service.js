import axios from '../../lib/axios';

export function searchByZipCode(zipCode) {
  return axios.get(`/zip-code?zipcode=${zipCode.toString().replace(/\D/g, '')}`);    
}
