import MainLayout from "../components/layout/MainLayout";
import {Col, Row, Card, Spin, Pagination, Button} from "antd";
import {useProducts, useProductsIndex} from "../hooks/Product";
import {useEffect, useState} from "react";
import utils from '../utils/index';
import getRoute from '../routes/defineRouteName';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {ClockCircleOutlined, InfoCircleOutlined, StopOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";


const { Meta } = Card;
const HomePage = () => {
    const stateAuth = useSelector((state) => state.auth)
    const [searchParams, setSearchParams] = useSearchParams();
    const [productLocal, setProductLocal] = useState([]);
    const navigate = useNavigate();
    const {loading, products, productCount, paged, setPaged, pageCount} = useProductsIndex();
    const onChangePagination = (page) => {
        setPaged(page);
        setSearchParams({page: page});
    };

    useEffect(() => {
        setProductLocal(products);
    }, [products])

    return (
        <Spin spinning={loading} className="spin-full">
            <MainLayout>
                <section id="product-list" className="padding-top-section">
                    <Row gutter={20}>
                        {productLocal.length > 0 && productLocal.map( value => <Col key={value.id} className="product-item" span={6}>
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

                                </div>} />
                                <div className="footer-card" style={{flexDirection: 'row-reverse'}}>
                                    <a href={'#'} onClick={() => { window.open(`${utils.makeSlugProduct(stateAuth.parentURL, value.name, value.code)}`)}}  className="ant-btn ant-btn-default btn-orange">Book Now</a>
                                    <p>From : <span className="font-bold">{utils.formatCurrency(value.price.gross, value.price.currency)}</span></p>
                                </div>
                            </Card>
                        </Col>)}
                    </Row>
                    {productLocal.length > 0 && <Pagination className="pagination-main" defaultCurrent={paged} total={productCount} onChange={onChangePagination} showSizeChanger={false} />}

                </section>
            </MainLayout>
        </Spin>

    )
};

export default HomePage;