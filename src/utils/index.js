import Base64 from 'crypto-js/enc-base64';
import hmacSHA1 from 'crypto-js/hmac-sha1';
import Utf8 from 'crypto-js/enc-utf8'
import {
    GlobalOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    UsergroupAddOutlined,
    ClockCircleOutlined,
    AimOutlined, BulbOutlined
} from "@ant-design/icons";
import { faUtensils} from '@fortawesome/free-solid-svg-icons'

import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


// const generateHolibobSignature = request => {
//     const date = request.date;
//     const APIKey = process.env.REACT_APP_HOLIBOB_API_KEY;
//     const method = request.method;
//     const path = '/graphql';
//     const body = JSON.stringify(request.body);
//     let canonical = date + APIKey + method + path + body;
//     return  Base64.stringify( hmacSHA1(canonical, process.env.REACT_APP_HOLIBOB_API_SECRET));
// }

const decimalAdjust = (type, value, exp) => {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

const getImageHolibob = id => {
    const imageObj = {
        key: `productImages/${id}`,
        edits: {
            resize: {
                fit: "cover"
            }
        }
    }
    return `https://images.holibob.tech/${Base64.stringify(Utf8.parse(JSON.stringify(imageObj)))}`;
}

const formatCurrency = (value, from = 'GBP', to = 'AUD', hasTo = true) => {
    let rate = 1;
    if (from == 'GBP') rate = 1.74;
    let formatValue = '$' + (value* rate).toFixed(2);
    if(hasTo) formatValue += (' '+ to);
    return  formatValue;
}
const convertCurrency = (value, from = 'GBP', to = 'AUD') => {
    let rate = 1;
    if (from == 'GBP') rate = 1.74;
    return  value * rate;
}

const formatContentListProduct = content => {
    let data = {};
    content.forEach(value => {
        if (!data[`${value.type}`]){
            data[`${value.type}`] = [];
        }
       data[`${value.type}`].push({description: value.description, order: value.ordinalPosition, name: value.name });
    });
    Object.keys(data).forEach(value => {
        data[value].sort((a,b) => a.order - b.order);
    })
    return data;
}

const formatAttrListProduct = attrs => {
    let data = {};
    attrs.forEach(value => {
        if (!data[`${value.level1}`]){
            data[`${value.level1}`] = [];
        }
        data[`${value.level1}`].push(value.name);
    })
    return data;
}


const renderIconAttrProduct = type => {
    let icon = null;
    switch (type){
        case 'Good To Know':
            icon = <InfoCircleOutlined />
            break;
        case 'Traveler Type':
            icon = <UsergroupAddOutlined />
            break;
        case 'Added Extras':
            icon = <PlusOutlined />
            break;
        case 'Guide Language':
            icon = <GlobalOutlined />
            break;
        case 'Duration':
            icon = <ClockCircleOutlined />
            break;
        case 'Tour Type':
            icon = <AimOutlined />
            break;
        case 'Accessibility':
            icon = <BulbOutlined />;
            break;
        case  'Food and Drink Included' :
            icon = <FontAwesomeIcon icon={faUtensils}/>
            break;
    }
    return icon;
}

const formatDurationISO8601 = duration => {
    const d = moment.duration(duration);
    let stringFormat = '';
    if(d.minutes()) stringFormat = `${d.minutes()} minutes`
    if (d.hours()) stringFormat = `${d.minutes() > 0 ?  d.hours() + 1 : d.hours()} hours `;
    if(d.days()) stringFormat = `${d.days()} ${d.days() > 1 ? 'days' : 'day'}`
    return stringFormat;
}

const getDataAvailabilityOptionListById = (data = [] ,keyId, keyValue) => {
    let item = data.filter(value => value.id == keyId);
    if (!item.length) return {key: '', value: ''};
    item = item[0];
    let answer = item.availableOptions.filter(item => item.value == keyValue);
    answer = answer.length ? answer[0].label : '';
    return  {key : item.label, value: answer};
}

const getDataAvailabilityPricingById = (data = [] ,keyId) => {
    let item = data.filter(value => value.id == keyId);
    if (!item.length) return {};
    item = item[0];
    return  item;
}

const removeMultiDownLine = data => {
    data = data.replaceAll('\r', '\n');
    for (let i = 10; i  >= 3 ; i--){
        let character = '';
        for (let j = 1; j <= i; j++){
            character += '\n';
        }
        if (data.includes(character)){
            data = data.replaceAll(character, '\n\n');
        }

    }
    return data;
}

const makeSlugProduct = (url ,name, code, prefix = 'api-product/sightseeing') => {
    return `${url}/${prefix}/${name.toLowerCase().replaceAll(' ', '-')}/${code}`
}


export default {
    // generateHolibobSignature: generateHolibobSignature,
    getImageHolibob: getImageHolibob,
    formatCurrency: formatCurrency,
    formatContentListProduct: formatContentListProduct,
    renderIconAttrProduct: renderIconAttrProduct,
    formatDurationISO8601: formatDurationISO8601,
    formatAttrListProduct: formatAttrListProduct,
    convertCurrency: convertCurrency,
    getDataAvailabilityOptionListById: getDataAvailabilityOptionListById,
    getDataAvailabilityPricingById: getDataAvailabilityPricingById,
    removeMultiDownLine: removeMultiDownLine,
    makeSlugProduct: makeSlugProduct
}