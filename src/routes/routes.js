import {Route, Routes} from "react-router-dom";
import ProductList from "../pages/products/ProductList";
import ProductDetail from "../pages/products/ProductDetail";
import HomePage from "../pages/HomePage";
import SearchProductList from "../pages/products/SearchProductList";

const RouteConfig = () =>{
    return (
        <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="product">
                <Route path="" element={<ProductList />}></Route>
                <Route path=":code" element={<ProductDetail />}></Route>
                <Route path=":attr/:id" element={<SearchProductList />}></Route>
            </Route>
        </Routes>
    )
}

export default RouteConfig;