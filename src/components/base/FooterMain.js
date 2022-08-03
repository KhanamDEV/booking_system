import {Button, Col, Form, Input, Row, Spin, message} from "antd";
import paymentMethodImage from '../../assets/images/payment-method.png';
import TKGSignature from '../../assets/images/TKG-Signiture-2.gif';
import Logo from '../../assets/images/twt_logo.png'
import {
    CalendarOutlined,
    FacebookOutlined,
    LinkedinOutlined, LockOutlined, MailFilled, MailOutlined, PhoneFilled,
    TwitterOutlined, UserOutlined,
    YoutubeOutlined
} from "@ant-design/icons";
import {useState} from "react";
import {subscribeUser} from "../../api/user";
import {useSearchParams} from "react-router-dom";
const FooterMain = () => {
    const [formSubscribe] = Form.useForm();
    const [loadingSubscribe, setLoadingSubscribe] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const sendSubscribe = async () => {
        setLoadingSubscribe(true);
        await subscribeUser(formSubscribe.getFieldsValue()).then(res => {
            message.success('Subscribe Success !');
            setLoadingSubscribe(false);
        })
    }

    return (0 ?  <footer id="footer-main">
        <div className="container">
            <section className={'main-content'}>
                <Row gutter={24}>
                    <Col span={6}>
                        <img className={'logo'} src={Logo} alt=""/>
                        <div className="item-content">
                            <b>RESERVATION: </b>
                            <p style={{marginTop: '10px'}}><PhoneFilled />1300 739 652</p>
                            <p><MailFilled />contact@tweetworldtravel.com.au</p>
                        </div>
                        <div className="item-content">
                            <b>24/7 Emergency support line:</b>
                            <p style={{marginTop: '10px'}} ><PhoneFilled />+61 (8) 7226 1898</p>
                        </div>
                        <div className="item-content">
                            <b>Trading Hours:</b>
                            <p style={{marginTop: '10px'}} ><CalendarOutlined />Monday to Saturday from 9am- 5.30pm</p>
                        </div>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={5}>
                        <h4 className={'title'}>Quick Links</h4>
                        <ul>
                            <li><a target='_blank' href="https://agentportal.tweetworldtravel.com/">Home</a></li>
                            <li><a target='_blank' href="https://agentportal.tweetworldtravel.com/posts/press-release/">News</a></li>
                            <li><a target='_blank' href="https://agentportal.tweetworldtravel.com/contact/">Contact Us</a></li>
                            <li><a target='_blank' href="https://agentportal.tweetworldtravel.com/posts/about-us/about-us">About Us</a></li>
                            <li><a target='_blank' href="https://www.smartraveller.gov.au/">Travel Advice</a></li>
                        </ul>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        <h4 className={'title'}>Products</h4>
                        <ul>
                            <li><a target='_blank' href="https://agentportal.tweetworldtravel.com/api-products/tour/">Tour</a></li>
                            <li><a target='_blank' href="https://agentportal.tweetworldtravel.com/api-products/cruise/">Cruise</a></li>
                            <li><a target='_blank' href="https://agentportal.tweetworldtravel.com/api-products/golf/">Golf Package</a></li>
                            <li><a target='_blank' href="https://agentportal.tweetworldtravel.com/api-products/holiday-package/">Holiday Package</a></li>
                            <li><a target='_blank' href="https://agentportal.tweetworldtravel.com/api-products/rail-package/">Rail Package</a></li>
                        </ul>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={5}>
                        <h4 className={'title'}>Subscribe now
                        </h4>
                        <p>Subscribe for our latest updates & promotions</p>
                        <Spin spinning={loadingSubscribe}>
                            <Form form={formSubscribe} onFinish={sendSubscribe}>
                                <Form.Item name="name" rules={[
                                    {
                                        required: true,
                                        message: 'Please input your name!',
                                    },
                                ]}>
                                    <Input size={'large'} placeholder={'Name'} prefix={<UserOutlined />} />
                                </Form.Item>
                                <Form.Item name="email" rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}>
                                    <Input size={'large'} placeholder={'Email'} prefix={<MailOutlined />} />
                                </Form.Item>
                                <p><LockOutlined /> Your information is safe with us.</p>
                                <div className={'content-right'}>
                                    <Button className={'btn-orange'} htmlType="submit">
                                        Subscribe now
                                    </Button>
                                </div>
                            </Form>
                        </Spin>

                    </Col>
                </Row>
            </section>
            <section className={'signature'}>
                <img src={TKGSignature} alt=""/>
                <div className="social">
                    <a href="https://www.facebook.com/Tweetworldtravel12/"><FacebookOutlined /></a>
                    <a href="https://twitter.com/TWorldTravel"><TwitterOutlined /></a>
                    <a href="https://www.linkedin.com/company/tweet-world-travel-group/"><LinkedinOutlined /></a>
                    <a href="https://www.youtube.com/channel/UCgw2O05QRJb3DEiVDS7RwSg"><YoutubeOutlined /></a>
                </div>
            </section>
        </div>
        <section className="term-payment-method">
            <div className="container">
                <div className="term">
                    <a href="https://agentportal.tweetworldtravel.com/terms-conditions" target="_blank">Term & Conditions</a>
                    <a href="https://agentportal.tweetworldtravel.com/privacy-policy" target="_blank">Privacy Policy</a>
                </div>
                <div className="payment-method">
                    <span className={'font-bold'}>We accept</span> <img src={paymentMethodImage} alt=""/>
                </div>
            </div>
        </section>
        <section className={'copyright'}>
            <div>
                <div>© Copyright 2022 - Powered by TKG Platform Technology</div>
            </div>
        </section>
    </footer> : <></>)
}

export default FooterMain;