import UrlPattern from "url-pattern";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const endPoint = {
    "API_PRODUCT_LIST" : `/products`,
    "API_PRODUCT_DETAIL": `/product-detail/:code`,
    "API_PRODUCT_FIND_BY_ID": `/find-product-by-id/:id`,
    "API_PRODUCT_INDEX": `/index`,
    "API_PRODUCT_FILTER_LIST" : `/get-filter-list-tree`,
    "API_PRODUCT_INTERESTED" : `/product-interested`,
    "API_PRODUCT_GET_AVAILABILITY": `/get-availability/:id`,
    "API_PRODUCT_GET_AVAILABILITY_LIST": `/get-availability-list-by-month`,
    "API_USER_SUBSCRIBE" : `/subscribe-user`,
    "API_PRODUCT_SEARCH" : `/search`,
    "API_BOOKING_ADD_QUOTE": "/add-quote",
    "API_CONVERT_QUOTE_TO_BOOKING": "/convert-quote-to-booking",
    "API_PRODUCT_BY_CATEGORIES": "/get-product-by-categories"
}

export const getURL = (name, params = {}) => {
    const pattern = new UrlPattern(endPoint[name]);
    let url = new URL(`${API_URL}${pattern.stringify(params)}`);
    let mappingParams = new URLSearchParams([
        ...Array.from(url.searchParams.entries()),
        ...Object.entries(params)
    ]);
    return `${url.origin}${url.pathname}?${mappingParams}`;
}

export default endPoint;