import {useEffect, useState} from "react";
import {
    findProductByCode,
    findProductById,
    getAvailability, getAvailabilityList,
    getFilterListTree, getProductByCategories,
    getProductIndex,
    getProductInterested,
    getProducts, search
} from "../api/product";
import utils from  '../utils/index'
import {useSearchParams} from "react-router-dom";
import {useLocation} from "react-router";

export function useProductsIndex(){
    const [searchParams, setSearchParams] = useSearchParams();
    let currentPage = searchParams.get('page');
    currentPage = currentPage ? currentPage : 1;
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [paged, setPaged] = useState(currentPage);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        await getProductIndex({page: paged}).then(res => {
            res = res.data.data.productList;
            let products = [];
            res.nodes.forEach(function (value){
                products.push({
                    id: value.id,
                    name: value.name,
                    description: value.description,
                    supplierName: value.supplierName,
                    price: value.holibobGuidePrice,
                    image: utils.getImageHolibob(value.previewImage.id),
                    isFeatured : value.isFeatured,
                    duration: value.minDuration == value.maxDuration ? utils.formatDurationISO8601(value.minDuration) : `${utils.formatDurationISO8601(value.minDuration)} - ${utils.formatDurationISO8601(value.maxDuration)}`,
                    isFreeCancel: value.cancellationPolicy.hasFreeCancellation,
                    code: value.code
                })
            });
            setProducts(products);
            setProductCount(res.recordCount);
            setPageCount(res.pageCount);
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [paged]);

    return {loading, products, productCount, paged, setPaged, pageCount}
}

export function useProducts(filter){
    const [searchParams, setSearchParams] = useSearchParams();
    let currentPage = searchParams.get('page');
    currentPage = currentPage ? currentPage : 1;
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [paged, setPaged] = useState(currentPage);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        await getProducts({page: paged, filter: JSON.stringify(filter)}).then(res => {
            res = res.data.data.productList;
            let products = [];
            res.nodes.forEach(function (value){
                products.push({
                    id: value.id,
                    name: value.name,
                    code: value.code,
                    description: value.description,
                    supplierName: value.supplierName,
                    price: value.holibobGuidePrice,
                    image: utils.getImageHolibob(value.previewImage.id),
                    isFeatured : value.isFeatured,
                    duration: value.minDuration == value.maxDuration ? utils.formatDurationISO8601(value.minDuration) : `${utils.formatDurationISO8601(value.minDuration)} - ${utils.formatDurationISO8601(value.maxDuration)}`,
                    isFreeCancel: value.cancellationPolicy.hasFreeCancellation
                })
            });
            setProducts(products);
            setProductCount(res.recordCount);
            setPageCount(res.pageCount);
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
            fetchData();
    }, [paged]);

    useEffect(() => {
            if (paged == 1){fetchData()}
            else{
                setPaged(1);
                setSearchParams({page: 1});
            }
    }, [filter])

    return {loading, products, productCount, paged, setPaged, pageCount}
}

export function useProductDetail(code){
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        await findProductByCode({code: code}).then(res => {
            res = res.data.data;
            res.product.contentList = utils.formatContentListProduct(res.product.contentList.nodes);
            res.product.attributeList = utils.formatAttrListProduct(res.product.attributeList.nodes);
            res.product.guideLanguageList = res.product.guideLanguageList.nodes;
            res.product.price = res.product.holibobGuidePrice;
            res.product.description = utils.removeMultiDownLine(res.product.description);
            res.product.categories = res.product.categoryList.nodes.map(value => value.id);
                setProduct(res.product);
            setLoading(false);
        })
    }
    useEffect(() => {
        fetchData();
    }, [])
    useEffect(() => {
        fetchData()
    }, [code])
    return {loading, product};
}

export function useGetFilterListTree(filter, attr){
    const [filterList, setFilterList] = useState({});
    const [loadingFilterList, setLoadingFilterList] = useState(true);

    const fetchData = async () => {
        await getFilterListTree({filter: JSON.stringify(filter), type: attr}).then(res => {
            setFilterList( res.data.data.productList);
            localStorage.setItem('filter', JSON.stringify(res.data.data.productList));
            setLoadingFilterList(false);
        }).catch(err => {
            if (localStorage.getItem('filter')){
                setFilterList(JSON.parse(localStorage.getItem('filter')));
            }
            setLoadingFilterList(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        fetchData();
    }, [filter])

    return {loadingFilterList, filterList}
}

export function useGetProductInterested(placeId, idIgnore){
    const [productInterestedLoading, setProductInterestedLoading] = useState(true);
    const [interestedProducts, setInterestedProducts] = useState([])
    const fetchData = async () => {
        if (placeId){
            await getProductInterested({placeId: placeId }).then(res => {
                res = res.data.data.productList;
                let products = [];
                res.nodes.forEach(function (value){
                    if (value.id != idIgnore){
                        products.push({
                            id: value.id,
                            name: value.name,
                            code: value.code,
                            description: value.description,
                            supplierName: value.supplierName,
                            price: value.holibobGuidePrice,
                            image: utils.getImageHolibob(value.previewImage.id),
                            isFeatured : value.isFeatured,
                            duration: value.minDuration == value.maxDuration ? utils.formatDurationISO8601(value.minDuration) : `${utils.formatDurationISO8601(value.minDuration)} - ${utils.formatDurationISO8601(value.maxDuration)}`,
                            isFreeCancel: value.cancellationPolicy.hasFreeCancellation
                        })
                    }
                });
                setInterestedProducts(products);
                setProductInterestedLoading(false);
            })
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchData();
    }, [placeId, idIgnore])
    return {productInterestedLoading, interestedProducts}
}

export function useGetAvailability(id = '', input = {}){
    const [loadingAvailability, setLoadingAvailability] = useState(true);
    const [availability, setAvailability] = useState(null)
    const fetchData = async () => {
        if (id){
            setLoadingAvailability(true);
            await getAvailability({id: id, input: JSON.stringify(input)}).then(res => {
                setAvailability(res.data.data.availability);
                setLoadingAvailability(false);
            });
        } else{
            setAvailability(null);
            setLoadingAvailability(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData()
    }, [id, input])
    return {loadingAvailability, availability};
}

export function useGetAvailabilityList(product_id, date){
    const [loadingAvailabilityList, setLoadingAvailabilityList] = useState(true);
    const [availabilityList, setAvailabilityList] = useState([]);
    const fetchData = async () => {
        if (product_id){
            setLoadingAvailabilityList(true);
            await getAvailabilityList({product_id: product_id, date: date}).then(res => {
                setAvailabilityList(res.data.data.availabilityList.nodes);
                setLoadingAvailabilityList(false);
            })
        }
    }
    useEffect(() => {
        fetchData();
    }, [date, product_id])

    return {loadingAvailabilityList, availabilityList}
}

export function useSearchProduct(keyword = ''){
    const [loadingSearch, setLoadingSearch] = useState(true);
    const [searchData, setSearchData] = useState([]);

    const fetchData = async () => {
        if (keyword){
            setLoadingSearch(true);
            setSearchData([]);
            await search({keyword: keyword}).then(res => {
                setSearchData(res.data.data.search.nodes);
                setLoadingSearch(false);
            })
        } else {
            setSearchData([]);
            setLoadingSearch(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [keyword])

    return {loadingSearch, searchData};
}

export function useGetProductByCategories(categories = [], idIgnore){
    const [loadingProductByCategories, setLoadingProductByCategories] = useState(true);
    const [productByCategories, setProductByCategories] = useState([]);
    const fetchData = async () => {
        setLoadingProductByCategories(true);
        await getProductByCategories({categories: JSON.stringify(categories)}).then(res => {
            res = res.data.data.productList;
            let products = [];
            res.nodes.forEach(function (value){
                if (value.id != idIgnore){
                    products.push({
                        id: value.id,
                        name: value.name,
                        code: value.code,
                        description: value.description,
                        supplierName: value.supplierName,
                        price: value.holibobGuidePrice,
                        image: utils.getImageHolibob(value.previewImage.id),
                        isFeatured : value.isFeatured,
                        duration: value.minDuration == value.maxDuration ? utils.formatDurationISO8601(value.minDuration) : `${utils.formatDurationISO8601(value.minDuration)} - ${utils.formatDurationISO8601(value.maxDuration)}`,
                        isFreeCancel: value.cancellationPolicy.hasFreeCancellation
                    })
                }
            });
            setProductByCategories(products);
            setLoadingProductByCategories(false);
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [categories])
    return {loadingProductByCategories, productByCategories}
}