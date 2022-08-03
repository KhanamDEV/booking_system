import {Button, Carousel, Input} from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider1 from '../../assets/images/carousel-slide-img-1.jpeg';
import {useEffect, useRef, useState} from "react";
import {useSearchProduct} from "../../hooks/Product";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faMap, faNewspaper, faHiking } from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom";
import getRoute from "../../routes/defineRouteName";
import {findProductById} from "../../api/product";
import {useSelector} from "react-redux";
import utils from "../../utils";

const {Search} = Input;
const SliderMain = () => {
    const stateAuth = useSelector(state => state.auth);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const {searchData, loadingSearch} = useSearchProduct(keyword);
    const [focusSearchInput, setFocusSearchInput] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [inputKeyup, setInputKeyup] = useState('');
    const [timeOutSearch, setTimeOutSearch] = useState(setTimeout(() => {}, 1000));
    const inputSearch = useRef(null);


    const onSearch = (value) => {
        inputSearch.current.focus();
        setKeyword(value);
    }

    useEffect(() => {
        if (isSearching && inputKeyup){
            setKeyword(inputKeyup);
            setIsSearching(false);
        }
    }, [isSearching])

    const onKeyupSearchBar = (e) => {
        setInputKeyup(e.target.value);
        clearTimeout(timeOutSearch);
        setTimeOutSearch(setTimeout(() => {
            setIsSearching(true);
        }, 1000))
    }

    const redirectResult =  (id, type) => {
        if (type == 'COUNTRY' || type == 'CITY'){
            navigate(getRoute('product.list_search', {attr: 'place', id: id}))
        } else if (type == 'PRODUCT'){
             findProductById({id: id}).then(res => {
                window.open(utils.makeSlugProduct(stateAuth.parentURL, res.data.data.product.name, res.data.data.product.code))
            })
        } else{
            navigate(getRoute('product.list_search', {attr: 'category', id: id}))
        }
    }

    return <section id="banner-main">
        <Slider className={"slick-banner-main"} {...{
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
        }}>
            <div>
                <img src={slider1} alt=""/>
            </div>
            <div>
                <img src={slider1} alt=""/>
            </div>
        </Slider>
        <div className="search-box">
            <p className={'mb-0 title-search'}>
                <span>FIND YOUR</span> <br/> <span>SIGHTSEEING</span>
            </p>
            <div className="form">
                <Search
                    ref={inputSearch}
                    onFocus={() => setFocusSearchInput(true)}
                    onBlur={(e) => {
                        setTimeout(() => {
                            setFocusSearchInput(false)
                        }, 150)
                    }}
                    placeholder="Enter keyword then hit the Search button"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                    onKeyUp={onKeyupSearchBar}
                    loading={loadingSearch}
                />
                {(searchData.length > 0 && focusSearchInput)  && <div className="result">
                    <ul>
                        {searchData.map( (value, index) => {
                            if (value.type != 'PRODUCT') return <li onClick={() => redirectResult(value.id, value.type)}
                                                                    key={index}> <FontAwesomeIcon style={{marginRight: '5px'}} icon={ value.type == 'COUNTRY' ? faMap : (value.type == 'PRODUCT' ? faHiking : faNewspaper) }/> {value.title}</li>
                        })}
                    </ul>
                </div>}

            </div>
        </div>
    </section>


}

export default SliderMain;