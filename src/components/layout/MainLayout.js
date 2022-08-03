import { Layout } from 'antd';
import HeaderMain from "../base/HeaderMain";
import SliderMain from "../base/SliderMain";
import FooterMain from "../base/FooterMain";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import {setState} from "../../redux/auth/authSlice";
const {Content} = Layout;
const MainLayout = (props) => {
    const {classContainer} = props;
    const dispatch = useDispatch();
    const [searchParam, setSearchParam] = useSearchParams();
    let stateAuth = {};
    if (searchParam.get('user_id')) stateAuth['userId'] = searchParam.get('user_id');
    if (searchParam.get('parent_url')) stateAuth['parentURL'] = searchParam.get('parent_url')
    if (searchParam.get('commission_rate')) stateAuth['commissionRate'] = searchParam.get('commission_rate')
    if (Object.keys(stateAuth).length){
        dispatch(setState(stateAuth))
    }
    return(
        <Layout>
            <HeaderMain />
            <SliderMain />
            <Content id="main-layout">
                <div className={classContainer ? classContainer : 'container'} >
                    {props.children}
                </div>
            </Content>
            <FooterMain />
        </Layout>
    )
}

export default MainLayout;