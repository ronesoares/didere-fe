import axios from '../../lib/axios';
import qs from 'qs';

export async function uploadFile(formData){
    return axios.post("/file/upload", formData, {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function downloadFile(file, module, shouldReturnOnlyBase64){    
    const config = {
        paramsSerializer: params => {
          return qs.stringify(params)
        },
        responseType: 'blob'
      };

    return axios.get(`/file/download?module=${module}&file.id=${file.id}&file.name=${file.name}`, config)
        .then(resp => {
            const saveByteArray = (function () {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                return function (data, name) {
                    var blob = new Blob(data, {type: "octet/stream"}),
                        url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = name;
                    a.click();
                    window.URL.revokeObjectURL(url);
                };
            }());
        
            if (shouldReturnOnlyBase64) {
                // Correção: Usar blobToBase64 para converter o blob para base64
                return blobToBase64(resp.data); 
            }
            else {
                saveByteArray([resp.data], file.name);
                return Promise.resolve();
            }
        }).catch(err => {
            console.error(err);
            return Promise.reject(err);
        });
}

export function deleteFile(fileId, module) {
    return axios.delete(`/file/${fileId}?module=${module}`);
}

// Função auxiliar para converter Blob para Base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // reader.result é a string base64 (data URL)
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function getFileAsBase64(file, module) {
    const config = {
        paramsSerializer: params => {
          return qs.stringify(params)
        },
        responseType: 'blob'
      };

    try {
        // Certifique-se de que 'file' aqui é o objeto que contém 'id' e 'name'
        // Ex: file.id, file.name
        const resp = await axios.get(`/file/download?module=${module}&file.id=${file.id}&file.name=${file.name}`, config);
        const base64String = await blobToBase64(resp.data);
        return base64String;
    } catch (err) {
        console.error(`Error fetching file ${file.name} as base64:`, err);
        // Retornar null ou uma string de imagem placeholder em base64 em caso de erro
        // Por exemplo: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' (pixel transparente)
        return null; 
    }
}