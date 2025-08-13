import axios from '../../lib/axios';

class AccessService {
  saveAccess(access, idProfile){

    if(access == null || access == undefined){
        return Promise.reject("Acessos nulo");
    };
    
    if(access?.id == 0){
        access.profile = {
            id: idProfile
        };
        
        return axios.post("/access", access); 
    } else {
        return axios.put("/access", access); 
    };
  };
  
  async getByProfile(idProfile){
    
    let access = [];

    if (idProfile > 0){
        let accessRequest = await axios.get(`/access/by-profile/${idProfile}`, {
            params: {
                orderBy: 'name'
            }
        });
    
        if(accessRequest.data.length > 0){
            access = accessRequest.data;
        };
    };

    let modules = await this.getModules();

    modules.map( mItem => {
        let mAccess = access.filter((aItem) => {
            return aItem?.module?.id == mItem.id; 
        });

        if(mAccess == null || mAccess.length == 0){
            access.push({ 
                id: 0,
                search: "Y",
                insert: "Y",
                update: "Y",
                delete: "Y",
                module: {
                        id: mItem.id,
                        name: mItem.name,
                }
            })
        };
    });
    
    access = access.sort((a, b) => { return a.module.name.localeCompare(b.module.name) })

    return Promise.resolve(access);
  };

  async getModules(){
    return axios.get("/module", {
        params: {
            orderBy: 'name'
        }
    })
    .then(resp => {
        return resp.data;
    });
  };
}

const accessService = new AccessService();

export default accessService;