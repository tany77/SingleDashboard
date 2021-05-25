import axios from 'axios';
import authService from '../components/api-authorization/AuthorizeService';

const baseUrl = "https://localhost:44300/api/Note/";

const token = async () => {
    return await authService.getAccessToken();
}

const currentUser = async () => {
    return await authService.getUser();
}
const headerWithToken = async () => {   
    return {
        headers: ! await token() ? {} : { 'Authorization': `Bearer ${await token()}` }
    };
}

export default {
    noteActions(url = baseUrl) {
        return {
            get: async (isCurrentUserOnly) => {
                const curUser = await currentUser();
                const endPoint = curUser.isAdmin && !isCurrentUserOnly ? 'GetAll' : 'GetByUserId/' + curUser.sub
                return axios.get(url + endPoint, await headerWithToken())
            },

            fetchById: async (id) => axios.get(url + 'GetNote/' + id, await headerWithToken()),

            create: async (newRecord) => {
                let curUser = await currentUser();
                newRecord.userId = curUser.sub;
                return axios.post(url + 'PostNote', { ...newRecord }, await headerWithToken())
            },

            update: async (id, updateRecord) => {
                let curUser = await authService.getUser();
                updateRecord.userId = curUser.sub;
                axios.put(url + 'PutNote/' + id, updateRecord, await headerWithToken())
            },

            delete: async (id) => {
                axios.delete(url + 'DeleteNote/' + id, await headerWithToken())
            },
        }
    }
}