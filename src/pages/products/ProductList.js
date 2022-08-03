import {useCallback, useMemo} from "react";
import MainLayout from "../../components/layout/MainLayout";
import {Col, Row, Card, Spin, Pagination, Button, Checkbox, Input, Select, DatePicker, Form} from "antd";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useGetFilterListTree, useProducts} from "../../hooks/Product";
import {v4 as uuidv4} from 'uuid';
import {useEffect, useState} from "react";
import utils from "../../utils";
import getRoute from "../../routes/defineRouteName";
import {Tree} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import MenuFilter from "../../components/product/MenuFilter";
import {useLocation} from "react-router";

const {Option} = Select;


const {Meta} = Card;
const ProductList = () => {
    const navigate = useNavigate();
    const dataNavigate = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    if (dataNavigate.state?.keyword){
        setSearchParams({keyword: dataNavigate.state.keyword})
    }
    const {loadingFilterList, filterList} = useGetFilterListTree();
    const [productLocal, setProductLocal] = useState([]);
    const {loading, products, productCount, paged, setPaged, setSearch} = useProducts();
    const [filter, setFilter] = useState({
        search: dataNavigate.state?.keyword ? dataNavigate.state.keyword : "",
        categoryIds: [],
        attributeIds: [],
        placeIds: [],
        sort: {isRecommended: 'desc'}
    });
    const [resetMenuFilter, setResetMenuFilter] = useState('');

    const [formSearch] = Form.useForm();

    useEffect(() => {
        setProductLocal(products);
    }, [products])

    useEffect(() => {
        // if (productLocal.length) {
            setSearch(filter);
        // }
    }, [filter])

    const changeSelectSort = value => {
        let filterCopy = {...filter}
        let sort = {};
        if (value == 'recommended') {
            sort = {isRecommended: 'desc'}
        } else if (value == 'price-asc') {
            sort = {guidePrice: 'asc'}
        } else if (value == 'price-desc') {
            sort = {guidePrice: 'desc'}
        }
        filterCopy.sort = sort;
        setFilter(filterCopy);
    }


    const onChangePagination = (page) => {
        setPaged(page);
        setSearchParams({page: page});
    };
    const changeFilter = (isChecked, value, type) => {
        setFilter((filter) => {
            let filterCopy = {...filter}
            if (isChecked) {
                filterCopy[type].push(value);
            } else {
                filterCopy[type] = filterCopy[type].filter(id => value != id);
            }
            console.log(filterCopy);
            return filterCopy;
        });
        if (searchParams.get('page')) setSearchParams({page: 1});

    }
    const memoizedChangeFilter = useCallback(changeFilter, []);

    const submitInputSearch = e => {
        if (e.keyCode == 13) {
            let filterCopy = {...filter}
            filterCopy.search = e.target.value;
            if (searchParams.get('page')) setSearchParams({page: 1});
            setFilter(filterCopy)
        }
    }

    const resetFormSearch = () =>{
        formSearch.resetFields();
        setResetMenuFilter(uuidv4());
        setFilter({
            search:  "",
            categoryIds: [],
            attributeIds: [],
            placeIds: [],
            sort: {isRecommended: 'desc'}
        })
    }

    return (
        <Spin spinning={loading} className="spin-full">
            <MainLayout classContainer={'container-detail'}>

                <section id="product-list-all" className="padding-top-section">
                    <Row>
                        <Col span={6}>
                            <h3 className="title-page text-center">FIND YOUR SIGHTSEEING</h3>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Spin spinning={loadingFilterList}>
                                <div className="filter box-shadow" style={{padding: '10px'}}>
                                    <Form form={formSearch} layout={"vertical"} className={'form-filter-product'}>
                                        <span onClick={resetFormSearch} style={{position: 'absolute', right: '15px', cursor: 'pointer', fontWeight: 'bold', zIndex: '99'}}>Reset All</span>
                                        <Form.Item label="Keyword" name="keyword">
                                            <Input style={{marginBottom: 15}} defaultValue={dataNavigate.state?.keyword ? dataNavigate.state.keyword : ""} size="large" placeholder="Keyword"
                                                   onKeyUp={(e) => submitInputSearch(e)}  prefix={<SearchOutlined/>}/>
                                        </Form.Item>
                                        <Form.Item label="Sort" name="sort">
                                            <Select
                                                style={{marginBottom: 15}}
                                                showSearch
                                                defaultValue="recommended"
                                                size="large"
                                                placeholder="Sort"
                                                className="w-100"
                                                onChange={changeSelectSort}
                                            >
                                                <Option value="recommended">Recommended</Option>
                                                <Option value="price-asc">Price Low To High</Option>
                                                <Option value="price-desc">Price High To Low</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item label="Departure Date" name="date">
                                            <DatePicker size={'large'} className={'w-100'} placeholder="Any Month"   picker="month" />
                                        </Form.Item>
                                    </Form>
                                    {!loadingFilterList &&
                                    <MenuFilter resetMenuFilter={resetMenuFilter} filterList={filterList} changeFilter={memoizedChangeFilter}/>}
                                </div>

                            </Spin>
                        </Col>
                        {productLocal.length > 0 && <Col span={18}  id={'product-list'}>
                            <Row gutter={20}>
                                {productLocal.map(value => <Col key={value.id} className="product-item" span={8}>
                                        <Card className="card-product"
                                              hoverable
                                              onClick={() => {
                                                  navigate(getRoute('product.detail', {id: value.id}))
                                              }}
                                              cover={<div className="box-image">
                                                  {value.isFeatured && <div className="badge">
                                                      <p className="mb-0">FEATURED</p>
                                                  </div>}
                                                  <img src={value.image} alt=""/>
                                              </div>}
                                        >
                                            <Meta title={value.name} description={value.description}/>
                                            <div className="footer-card" style={{flexDirection: 'row-reverse'}}>
                                                <Button className={'btn-orange'} onClick={() => {
                                                    navigate(getRoute('product.detail', {id: value.id}))
                                                }}>
                                                    Book Now
                                                </Button>
                                                <p>From : <span
                                                    className="font-bold">{utils.formatCurrency(value.price.gross, value.price.currency)}</span>
                                                </p>
                                            </div>
                                        </Card>
                                    </Col>
                                )}
                            </Row>

                            {productLocal.length > 0 &&
                            <Pagination className="pagination-main" defaultCurrent={paged} current={paged}
                                        total={productCount} onChange={onChangePagination} showSizeChanger={false}/>}

                        </Col>}

                    </Row>
                </section>
            </MainLayout>
        </Spin>

    );
};
{/*<Row onClick={() => {navigate(getRoute('product.detail', {id: value.id}))}}>*/
}
{/*    <Col span={8}>*/
}

{/*    </Col>*/
}
{/*    <Col span={16} className={'box-shadow'}>*/
}
{/*        <div className="content">*/
}
{/*            <h4>{value.name}</h4>*/
}
{/*            <p>{value.description}</p>*/
}
{/*            <div className="area-book">*/
}
{/*                <p className="mb-0">From : <span className="font-bold">{utils.formatCurrency(value.price.gross, value.price.currency)}</span></p>*/
}
{/*                <Button onClick={() => {navigate(getRoute('product.detail', {id: value.id}))}} className={'btn-orange'}>*/
}
{/*                    View detail*/
}
{/*                </Button>*/
}
{/*            </div>*/
}
{/*        </div>*/
}
{/*    </Col>*/
}
{/*</Row>*/
}
export default ProductList;
