import UrlPattern from "url-pattern";

const nameRoute = {
    'index': '/',
    'product.list' : '/product',
    'product.detail': '/product/:code',
    'product.list_search': '/product/:attr/:id'
}

export default function (name, params){
    const pattern = new UrlPattern(nameRoute[name]);
    return pattern.stringify(params);
}