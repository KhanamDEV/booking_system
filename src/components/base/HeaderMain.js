import {Button, Layout, Menu, Select, Space} from 'antd';
import logoTWT from '../../assets/images/twt_logo.png';
import TenYear from '../../assets/images/10-year-anniversary-logo.png';
import getRoute from "../../routes/defineRouteName";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {PhoneFilled, DownOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import {useEffect} from "react";

const { Header } = Layout;

const { Option } = Select;


const HeaderMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const onSearch = value => {
        navigate(getRoute('product.list'), {state : {keyword: value}} )
    }

    return ( 0 ?
        <Header>
            <div id="wrap-header">
                <section className={'header-top'}>
                        <div className="left">
                            <ul>
                                <li>
                                    <a href="https://agentportal.tweetworldtravel.com/contact">Contact Us</a>
                                </li>
                                <li>
                                    <a href="tel: 1300 739 652 ">
                                        <PhoneFilled/> 1300 739 652
                                    </a>
                                    <span className="text-white ">or</span>
                                    <a href="tel: +61 (8) 72261898">+61
                                        (8) 7226 1898</a>
                                </li>
                                <li>
                                    <a href="https://www.tweetworldtravel.com.au/brochures-collection/">Brochures</a>
                                </li>
                            </ul>
                        </div>
                        <div className="right">
                            {/*<Select*/}
                            {/*    defaultValue="AUD"*/}
                            {/*>*/}
                            {/*    <Option value="AUD">AUD</Option>*/}
                            {/*    <Option value="GBP">GBP</Option>*/}

                            {/*</Select>*/}
                        </div>
                </section>
                <section className={'header-bottom'}>
                    <div className="image">
                        <img src={TenYear} alt=""/>
                        <img onClick={() => {
                            navigate(getRoute('index'))
                        }} className="logo" src={logoTWT} alt=""/>
                        <Button className={(location.pathname != '/') ? 'active' : ''} onClick={() => {
                            navigate(getRoute('index'))
                        }}>
                            Sightseeing/Activity
                        </Button>
                    </div>

                    <div className="search">
                        <Search  defaultValue={location.state?.keyword ? location.state.keyword : ""} placeholder="Search for great deals" enterButton />
                    </div>
                </section>

            </div>
        </Header> : <></>
    );

}

export default HeaderMain;