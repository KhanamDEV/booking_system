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
import {ClockCircleOutlined, InfoCircleOutlined, SearchOutlined, StopOutlined} from "@ant-design/icons";
import MenuFilter from "../../components/product/MenuFilter";
import {useLocation} from "react-router";
import {useSelector} from "react-redux";

const {Option} = Select;


const {Meta} = Card;
const SearchProductList = () => {
    const stateAuth = useSelector((state) => state.auth)
    const { attr ,id } = useParams();
    const navigate = useNavigate();
    const dataNavigate = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultFilter = {
        search:  "",
        categoryIds: [],
        attributeIds: [],
        placeIds: [],
        sort: {isRecommended: 'desc'}
    }
    if (attr == 'category') defaultFilter.categoryIds.push(id);
    if (attr == 'place') defaultFilter.placeIds.push(id);
    if (dataNavigate.state?.keyword){
        setSearchParams({keyword: dataNavigate.state.keyword})
    }
    const [filter, setFilter] = useState(defaultFilter);
    const {loadingFilterList, filterList} = useGetFilterListTree(filter, attr);
    const [productLocal, setProductLocal] = useState([]);
    const {loading, products, productCount, paged, setPaged} = useProducts(filter);
    const [resetMenuFilter, setResetMenuFilter] = useState('');
    const [visibleMenuFilter, setVisibleMenuFilter] = useState(false);

    const [formSearch] = Form.useForm();

    useEffect(() => {
        setProductLocal(products);
    }, [products])

    useEffect(() => {
        setVisibleMenuFilter(true);
    }, [filterList])

    useEffect(() => {
        formSearch.resetFields();
        setVisibleMenuFilter(false);
        setFilter(defaultFilter)
    }, [attr, id])

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
        setFilter(defaultFilter)
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
                                    {(!loadingFilterList && visibleMenuFilter) &&
                                    <MenuFilter resetMenuFilter={resetMenuFilter} filterList={filterList} changeFilter={memoizedChangeFilter}/>}
                                </div>

                            </Spin>
                        </Col>
                        {productLocal.length > 0 && <Col span={18}  id={'product-list'}>
                            <Row gutter={20}>
                                {productLocal.map(value => <Col key={value.id} className="product-item" span={8}>
                                        <Card className="card-product"
                                              hoverable
                                              onClick={() => { window.open(`${utils.makeSlugProduct(stateAuth.parentURL, value.name, value.code)}`)}}
                                              cover={<div className="box-image">
                                                  {value.isFeatured && <div className="badge">
                                                      <p className="mb-0">FEATURED</p>
                                                  </div>}
                                                  <img src={value.image} alt=""/>
                                              </div>}
                                        >
                                            <Meta title={value.name} description={<div>
                                                <div className="content">
                                                    {value.description}
                                                </div>
                                                <div className="more-info">
                                                    {value.duration && <span><ClockCircleOutlined /> {value.duration}</span>}
                                                    {value.isFreeCancel && <span><StopOutlined /> Free Cancellation</span>}
                                                    <span><InfoCircleOutlined /> Instant Confirmation</span>
                                                </div>

                                            </div>}/>
                                            <div className="footer-card" style={{flexDirection: 'row-reverse'}}>
                                                <a href={'#'} onClick={() => { window.open(`${utils.makeSlugProduct(stateAuth.parentURL, value.name, value.code)}`)}}  className="ant-btn ant-btn-default btn-orange">Book Now</a>
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

export default SearchProductList;
