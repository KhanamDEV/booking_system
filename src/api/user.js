import * as api from "./xhr";
import * as endPoint from "./xhr/apiRoute";

export async function subscribeUser(data = {}){
    return await api.get(endPoint.getURL('API_USER_SUBSCRIBE', data));
}