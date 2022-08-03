import * as api from './xhr';
import * as endPoint from "./xhr/apiRoute";

export async function getProductIndex(params = {}){
    return await api.get(endPoint.getURL('API_PRODUCT_INDEX', params));
}

export async function getProducts(params = {}){
    return await api.get(endPoint.getURL('API_PRODUCT_LIST', params));
}

export async function findProductByCode(params = {}){
    return await  api.get(endPoint.getURL('API_PRODUCT_DETAIL', params));
}

export async function getFilterListTree(params = {}){
    return await  api.get(endPoint.getURL('API_PRODUCT_FILTER_LIST', params));
}

export async function getProductInterested(params = {}){
    return await  api.get(endPoint.getURL('API_PRODUCT_INTERESTED', params));
}

export async function getAvailability(params = {}){
    const URL = endPoint.getURL('API_PRODUCT_GET_AVAILABILITY', params);
    return await  api.get(URL);
}

export async function getAvailabilityList(params = {}){
    return await api.get(endPoint.getURL('API_PRODUCT_GET_AVAILABILITY_LIST', params));
}

export async function search(params = {}){
    return await api.get(endPoint.getURL('API_PRODUCT_SEARCH', params));
}

export async function addQuote(data = {}){
    return await api.post(endPoint.getURL('API_BOOKING_ADD_QUOTE'), data);
}

export async function convertQuoteToBooking(data = {}){
    return await api.post(endPoint.getURL('API_CONVERT_QUOTE_TO_BOOKING'), data);
}

export async function findProductById(params = {}){
    return await api.get(endPoint.getURL('API_PRODUCT_FIND_BY_ID', params));
}

export async function getProductByCategories(params = {}){
    return await api.get(endPoint.getURL('API_PRODUCT_BY_CATEGORIES', params));
}