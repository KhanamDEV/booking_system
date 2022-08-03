import MainLayout from "../../components/layout/MainLayout";
import {Button, Calendar, Card, Carousel, Col, Collapse, Row, Spin, Tabs} from "antd";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Component, useEffect, useRef, useState} from "react";
import {useGetProductByCategories, useGetProductInterested, useProductDetail} from "../../hooks/Product";
import utils from '../../utils/index';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import getRoute from "../../routes/defineRouteName";
import Meta from "antd/es/card/Meta";
import ModalBooking from "../../components/booking/ModalBooking";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faMap, faUtensils } from '@fortawesome/free-solid-svg-icons'
import {ClockCircleOutlined, InfoCircleOutlined, StopOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {setState} from "../../redux/auth/authSlice";


const { TabPane } = Tabs;
const { Panel } = Collapse;

const ProductDetail = () => {

    const userId = useSelector((state) => state.auth.userId)

    const [searchParam, setSearchParam] = useSearchParams();
    const dispatch = useDispatch();
    let stateAuth = {};
    if (searchParam.get('user_id')) stateAuth['userId'] = searchParam.get('user_id');
    if (searchParam.get('parent_url')) stateAuth['parentURL'] = searchParam.get('parent_url')
    if (searchParam.get('commission_rate')) stateAuth['commissionRate'] = searchParam.get('commission_rate')
    if (Object.keys(stateAuth).length){
        dispatch(setState(stateAuth))
    }
    const { code } = useParams();
    const [id, setId] = useState(''); // id product
    const [placeId, setPlaceId] = useState('');
    const navigate = useNavigate();
    const [productLocal, setProductLocal] = useState({});
    const [interestedProductsLocal, setInterestedProductsLocal] = useState([]);
    const {product, loading} = useProductDetail(code);
    const {productInterestedLoading, interestedProducts} = useGetProductInterested(placeId, id);
    const {loadingProductByCategories, productByCategories} = useGetProductByCategories(product.categories, id);
    const [imageGallery, setImageGallery] = useState([]);
    const [modalBookingProps, setModalBookingProps] = useState({visible: false, productId: id, name: '', product: product});
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        setProductLocal(product);
        if (Object.keys(product).length){
            let newImageGallery = [];
            product.imageList.forEach(value =>  newImageGallery.push({original: value.url, thumbnail: value.url}));
            setImageGallery(newImageGallery);
            setPlaceId(product.place.countryId);
            setModalBookingProps({...modalBookingProps, ...{name: product.name, product: product}})
            setId(product.id);
        }

    }, [product])

    useEffect(() => {
        console.log(productByCategories);
    }, [productByCategories])

    useEffect(() => {
        setInterestedProductsLocal(interestedProducts);
    }, [interestedProducts]);


    const setVisibleModalBook = visible => {
        setModalBookingProps({...modalBookingProps, ...{visible: visible}})
    }

    return (
        <Spin spinning={loading} className="spin-full">
            <MainLayout classContainer={'container-detail'}>
                {Object.keys(product).length > 0 && <section id="product-detail" className="padding-top-section">
                    <Row gutter={'30'}>
                        <Col span={19}>
                            <p className="product-name mb-0">{product.name.toUpperCase()}</p>
                            <p style={{marginTop: '5px'}}> <FontAwesomeIcon icon={faMap}/> <span style={{marginLeft: '10px', fontStyle: 'italic'}}>{product.geoName} </span> </p>
                            <div className="list-button-change-content-list">
                                <Button className={activeTab == 'overview' ? 'active' : ''}
                                        onClick={() => setActiveTab('overview')}>OVERVIEW</Button>
                                {Object.keys(product.contentList).length > 0 && Object.keys(product.contentList).map((key, index) =>
                                    <Button key={index} className={activeTab == index ? 'active' : ''}
                                            onClick={() => setActiveTab(`${index}`)}>{key.replaceAll("_", " ")}</Button>)}
                            </div>

                            <Row gutter={24}>
                                <Col span={11}>
                                    <div className="carousel-image">
                                        <ImageGallery lazyLoad={true} useTranslate3D={true} autoPlay={true}
                                                      items={imageGallery}/>
                                    </div>
                                </Col>
                                <Col span={13}>
                                    <Tabs activeKey={`${activeTab}`} className={'tab-content-list-product box-shadow'}>
                                        <TabPane key={'overview'}>
                                            <p>{product.description}</p>
                                            {(product?.minDuration && product?.maxDuration) &&
                                            <p><strong>Duration: </strong>
                                                {product.minDuration == product.maxDuration ? utils.formatDurationISO8601(product.minDuration) : `${utils.formatDurationISO8601(product.minDuration)} - ${utils.formatDurationISO8601(product.maxDuration)}`}
                                            </p>}
                                            {product?.supplierName && <p><strong>Operator: </strong> {product.supplierName}</p>}
                                            {product?.place?.countryName && <p><strong>Country: </strong> {product.place.countryName }</p>}

                                        </TabPane>
                                        {Object.keys(product.contentList).length > 0 && Object.keys(product.contentList).map((key, index) =>
                                            <TabPane tab="Tab 1" key={index}>
                                                {product.contentList[key].map((value, indexChild) => <div
                                                    key={indexChild}
                                                    dangerouslySetInnerHTML={{__html: `${value.name ? `<strong>${value.name}</strong>` : ''} ${value.description ? value.description : ''}`}}></div>)}
                                            </TabPane>)}
                                    </Tabs>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={11}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px'}}>
                                        <p className={'mb-0'} style={{fontSize: '17px', fontWeight: 'bold'}}> From  {utils.formatCurrency(product.price.gross, product.price.currency)} </p>
                                        <Button size={"large"} onClick={() => setVisibleModalBook(true)}  className={'btn-orange'} >
                                            Book Now
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            {(product.guideLanguageList.length > 0 || Object.keys(product.attributeList).length > 0) &&
                            <div className="attribute-list box-shadow">
                                {product.guideLanguageList.length > 0 && <div className="box-attribute">
                                    <div className="left">
                                        {utils.renderIconAttrProduct('Guide Language')}
                                    </div>
                                    <div className="right">
                                        <span>Guide Language</span>
                                        {product.guideLanguageList.length > 3 ? (<p>Multiple</p>) : (
                                            <p>{product.guideLanguageList.map((value, index) => <span
                                                key={index}>{index ? ', ' : ''}{value.name}</span>)}</p>
                                        )}
                                    </div>
                                </div>}
                                {
                                    Object.keys(product.attributeList).map((value, index) => <div key={index}
                                                                                                  className="box-attribute">
                                        <div className="left">
                                            {utils.renderIconAttrProduct(value)}
                                        </div>
                                        <div className="right">
                                            <span>{value}</span>
                                            <p>{product.attributeList[value].map((value, childIndex) => ` ${childIndex ? ', ' : ''} ${value}`)}</p>
                                        </div>
                                    </div>)
                                }

                            </div>}
                        </Col>
                        <Col span={5}>
                            <div className="maybe-interested">
                                <p className="product-name text-center mt-0">You may be interested in</p>
                                <Spin spinning={productInterestedLoading}>
                                    <div id="product-list">
                                        {interestedProductsLocal.length > 0 && interestedProductsLocal.map((value, index) =>
                                            <div key={value.id} className={`product-item small`}>
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
                                                            {/*{value.isFreeCancel && <span><StopOutlined /> Free Cancellation</span>}*/}
                                                            {/*<span><InfoCircleOutlined /> Instant Confirmation</span>*/}
                                                        </div>

                                                    </div>} />
                                                    <div className="footer-card" style={{flexDirection: 'row-reverse'}}>
                                                        <a href={'#'} onClick={() => { window.open(`${utils.makeSlugProduct(stateAuth.parentURL, value.name, value.code)}`)}}  className="ant-btn ant-btn-default btn-orange">Book Now</a>
                                                        <p>From : <span className="font-bold">{utils.formatCurrency(value.price.gross, value.price.currency)}</span></p>
                                                    </div>
                                                </Card>
                                            </div>)}
                                    </div>


                                </Spin>

                            </div>

                        </Col>
                    </Row>
                    <div className="h-divider">
                        <div className="shadow-divider"></div>
                    </div>
                    <p className="product-name text-center mt-0">Recommended popular similar packages</p>
                    <Spin spinning={loadingProductByCategories}>
                        <Slider {...{
                            dots: true,
                            infinite: true,
                            speed: 500,
                            slidesToShow: 4,
                            slidesToScroll: 4,
                            arrow: true,
                        }}>
                            {productByCategories.length > 0 && productByCategories.map( (value, index) => <div key={value.id}  className={`product-item slick-item-product`}  >
                                <Card className="card-product"
                                      hoverable
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
                            </div>)}

                        </Slider>
                    </Spin>

                    <ModalBooking {...modalBookingProps} setVisibleModalBook={setVisibleModalBook}/>
                </section>}

            </MainLayout>
        </Spin>

    );

}

export default ProductDetail;