import Modal from "antd/es/modal/Modal";
import {useEffect, useState} from "react";
import {
    Alert,
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Row,
    Select,
    Spin,
    Steps,
    Tabs,
    Radio,
    Checkbox,
} from "antd";
import moment from "moment";
import {useGetAvailability, useGetAvailabilityList} from "../../hooks/Product";
import AmountPassenger from "./AmountPassenger";
import utils from '../../utils/index'
import countryCodes from "../../utils/data/countryCodes";
import paymentMethod from '../../assets/images/payment-method.png'
import success from '../../assets/images/success.png'
import {CheckCircleOutlined} from "@ant-design/icons";
import {v4 as uuidv4} from "uuid";
import {click} from "@testing-library/user-event/dist/click";
import {addQuote, convertQuoteToBooking} from "../../api/product";
import {useSelector} from "react-redux";

const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;
const { TabPane } = Tabs;



const ModalBooking = (props) => {
    const stateAuth = useSelector((state) => state.auth)
    const {visible, productId, setVisibleModalBook, name, product} = props;
    const [dateSelect, setDateSelect] = useState(moment().format('YYYY-MM'));

    const [availabilityId, setAvailabilityId] = useState('');
    const [inputListFilter, setInputListFilter] = useState({ optionList: {}, pricingCategoryList: {}})
    const {loadingAvailability, availability} = useGetAvailability(availabilityId, inputListFilter);
    const {loadingAvailabilityList, availabilityList} = useGetAvailabilityList(product.id, dateSelect)
    const [loadingContinueModal, setLoadingContinueModal] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [successFirstStep, setSuccessFirstStep] = useState(false);
    const [valueDefaultDatePicker, setValueDefaultDatePicker] = useState( '');
    const [valueDepartureSelect, setValueDepartureSelect] = useState('');
    const [step, setStep] = useState(0);
    const [isCheckedCheckBoxTerm, setIsCheckedCheckboxTerm] = useState(null);
    const [electronicFundTransfer, setElectronicFundTransfer] = useState(1);
    const [isShowButtonSubmitStepPayment, setIsShowButtonSubmitStepPayment] = useState(true);
    const [leader, setLeader] = useState('');
    const [loadingAddQuote, setLoadingAddQuote] = useState(false);
    const [bookingInfo, setBookingInfo] = useState({});

    //form
    const [firstStepForm] = Form.useForm();
    const [secondStepForm] = Form.useForm();
    const [thirdStepForm] = Form.useForm();

    useEffect(() => {
        calculatePrice(inputListFilter.pricingCategoryList)
        setLeader('');
    }, [availability])

    useEffect(() => {
        if ( valueDepartureSelect != ''){
            if (moment(valueDefaultDatePicker).format('YYYY-MM-DD') != moment(valueDepartureSelect).format('YYYY-MM-DD')){
                onChangeDepartureDay(valueDepartureSelect);
            }
        }
    }, [availabilityList])

    const steps = [
        {title: 'Booking Process'}, {title: 'Passenger Details'}, {title: 'Booking Summary'}, {title: 'Payment Option'}, {title: 'Submit'}
    ];

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current <= moment().subtract(1, 'd');
    };


    const onChangeDepartureDay = (date) => {
        let dateString = moment(date).format('YYYY-MM-DD')
        let yearMonthSelect = moment(dateString).format('YYYY-MM');
        if (dateSelect == yearMonthSelect){
            if ( dateString == moment().format('YYYY-MM-DD') || moment(dateString).isAfter(moment().format('YYYY-MM-DD')) ){
                let isSoldOut = false;
                let dateChange = availabilityList.filter(value => {
                    if (value.date == moment(dateString).format('YYYY-MM-DD')) isSoldOut = value.soldOut;
                    return value.date == moment(dateString).format('YYYY-MM-DD') && !value.soldOut
                })
                if (!dateChange.length){
                    if (isSoldOut) message.error(`There are no trips on selected date `)
                    else message.error(`There are no trips on selected date`)
                } else{
                    setValueDefaultDatePicker(date);
                    setInputListFilter({ optionList: {}, pricingCategoryList: {}})
                    setAvailabilityId(dateChange[0].id)
                }
            } else{
                console.log(valueDefaultDatePicker);
            }
        } else{
            setDateSelect(yearMonthSelect);
            setValueDepartureSelect(date);
        }

    }

    const changeSelectOptionList = () => {
        // setLoadingContinueModal(true);
        let fieldValue = Object.keys(firstStepForm.getFieldsValue());
        let newOptionList = {};
        if (fieldValue.length){
            let flag = false;
            fieldValue.forEach(value => {
                if (!flag){
                    newOptionList[value] = firstStepForm.getFieldsValue()[value];
                    if (firstStepForm.getFieldsValue()[value] != inputListFilter.optionList[value]
                        && Object.keys(inputListFilter.optionList).includes(value)
                    ) flag = true;
                }

            })
        }
        setInputListFilter({...inputListFilter, ...{optionList:  newOptionList }});
    }

    const nextStep = async () => {
        if (step == 1){
            secondStepForm.validateFields().then(value => {
                 setStep(step+1)
            }).catch(res => {

            })
        }  else if(step == 2){
            if (isCheckedCheckBoxTerm == null) setIsCheckedCheckboxTerm(false);
            if (isCheckedCheckBoxTerm){
                setLoadingAddQuote(true);
                let duration = 0;
                if (product.minDuration){
                    duration = moment.duration(product.minDuration)._milliseconds;
                } else if(product.maxDuration){
                    duration = moment.duration(product.maxDuration)._milliseconds;
                }
                let data = {
                    product: {
                        id: product.id,
                        name: product.name,
                        code: product.code,
                        duration: duration,
                        previewImage: utils.getImageHolibob(product.previewImage.id),
                        durationText: product.minDuration == product.maxDuration ? utils.formatDurationISO8601(product.minDuration) : `${utils.formatDurationISO8601(product.minDuration)} - ${utils.formatDurationISO8601(product.maxDuration)}`,
                        country: product?.place?.countryName,
                        operator: product.supplierName,
                        contentList: product.contentList,
                        description: product.description,
                        geoName: product.geoName,
                        attributeList: product.attributeList,
                        guideLanguageList: product.guideLanguageList
                    },
                    optionList: availability.optionList.nodes,
                    options:  firstStepForm.getFieldsValue(),
                    passenger: secondStepForm.getFieldsValue(),
                    clientNote: thirdStepForm.getFieldsValue(),
                    userId: stateAuth.userId,
                    totalPrice: totalPrice,
                    leader: leader,
                    startDate: moment(valueDefaultDatePicker).format('YYYY-MM-DD')
                }
                Object.keys(data.passenger).forEach((value => {
                    if (value.includes('birthday')){
                        data.passenger[value] = moment(data.passenger[value]).format('YYYY-MM-DD')
                    }
                }))
                await addQuote(data).then(res => {
                    let bookingInfoFromApi = res.data;
                    bookingInfoFromApi['payment_type'] = null;
                    bookingInfoFromApi['payment_amount'] = 0;
                    bookingInfoFromApi['payment_method'] = 2;
                    bookingInfoFromApi['user_id'] = stateAuth.userId;
                    setBookingInfo(bookingInfoFromApi);
                    setLoadingAddQuote(false);
                    setIsShowButtonSubmitStepPayment(false);
                    setStep(step + 1);
                })

            }
        } else if(step == 3){
            setLoadingAddQuote(true);

            await convertQuoteToBooking(bookingInfo).then(res => {
                setLoadingAddQuote(false);
                setStep(step + 1);
            }).catch(err => {
                console.log(err);
            })
        }
        else if(step == 4){
             cancelBooking();
        } else {
            setStep(step+1);
        }
    }

    const prevStep = () => {
        if (step == 1 || step == 2){
            setStep(step - 1);
        }
    }

    const calculatePrice = (currentPricingCategoryList) => {
        let price = 0;
        if (availability?.pricingCategoryList?.nodes){
            let listPricingCategoryList = availability.pricingCategoryList.nodes;
            Object.keys(currentPricingCategoryList).forEach(value => {
                let unitPrice = listPricingCategoryList.filter(item => item.id == value)
                if(unitPrice.length){
                    unitPrice = unitPrice[0].unitPrice;
                    price += utils.convertCurrency(currentPricingCategoryList[value] * unitPrice.gross, unitPrice.currency, 'AUD');
                }
            })
        }
        setSuccessFirstStep(price > 0);
        setTotalPrice(price);
    }

    const updatePricingCategoryList = (id, units) => {
        let currentPricingCategoryList = {...inputListFilter.pricingCategoryList};
        let pricingCategoryList = {};
        availability.pricingCategoryList.nodes.forEach(value => {
            if (value.id == id){
                pricingCategoryList[value.id] = units
            } else {
                pricingCategoryList[value.id] = currentPricingCategoryList[value.id] ?? 0
            }
        })
        let newInputListFilter = {...inputListFilter, ...{pricingCategoryList: pricingCategoryList}}
        setInputListFilter(newInputListFilter);
    }

    const cancelBooking = () => {
        setVisibleModalBook(false);
        setInputListFilter({ optionList: {}, pricingCategoryList: {}})
        setAvailabilityId('');
        setDateSelect(moment().format('YYYY-MM'));
        setLoadingContinueModal(false);
        setTotalPrice(0);
        setSuccessFirstStep(false);
        setValueDefaultDatePicker('');
        setStep(0);
        setIsCheckedCheckboxTerm(null);
        secondStepForm.resetFields();
        setElectronicFundTransfer(1);
        setIsShowButtonSubmitStepPayment(true);
        setValueDepartureSelect('');
    }


    const onChangePaymentMethod = (activeKey) => {
        let bookingInfoCopy = {...bookingInfo};
        bookingInfoCopy['payment_type'] = null;
        bookingInfoCopy['payment_amount'] = 0;
        if (activeKey == 2){
            bookingInfoCopy['payment_method'] = 3;
            setBookingInfo(bookingInfoCopy);
            setIsShowButtonSubmitStepPayment(true);
        } else{
            if (activeKey == 1 && electronicFundTransfer == 2) {
                bookingInfoCopy['payment_method'] = 2;
                setBookingInfo(bookingInfoCopy);
                setIsShowButtonSubmitStepPayment(true);
            }  else{
                setIsShowButtonSubmitStepPayment(false);
            }
        }
    }

    return <Modal
        visible={props.visible}
        confirmLoading={loadingContinueModal}
        onCancel={cancelBooking}
        cancelButtonProps={{style: {display: 'none'}}}
        width={1350}
        className="modal-booking"
        style={{
            top: 20,
        }}
        footer={[
            <Button style={{opacity: step == 1 || step == 2 ? 1:  0}}  onClick={prevStep}>
                Back
            </Button>,
            <Button type="primary" style={{display: successFirstStep && isShowButtonSubmitStepPayment ? 'inline-block' : 'none'}} onClick={nextStep}>
                {step == 4 ? 'Done' :  (step == 3 ? 'Submit' : 'Next') }
            </Button>

        ]}
    >
        <Spin spinning={loadingAvailability || loadingAvailabilityList || loadingAddQuote}>
            <Steps current={step} >
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <Form style={{ display: step ? 'none' : 'block' }}  form={firstStepForm} name="first-step" id="form-booking" layout={"vertical"}>
                <p>Product Name: {name}</p>
                <div className="area-date-time">
                    <Row className="w-100">
                        <Col span={6}>
                            <Form.Item label="Select Date" >
                                <DatePicker
                                    allowClear={false}
                                    disabledDate={disabledDate}
                                    onChange={onChangeDepartureDay}
                                    value={valueDefaultDatePicker}
                                />
                            </Form.Item>
                        </Col>
                        {(availability && availability.optionList != null) && availability.optionList.nodes.map((value, index) => <Col key={value.id} span={6}>
                            <Form.Item label={value.label} name={value.id} initialValue={value.answerValue}>
                                <Select
                                    defaultValue={value.answerValue}
                                    onChange={changeSelectOptionList}
                                >
                                    {value.availableOptions.map(item  => <Option key={item.value} value={item.value}>{item.label}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>) }

                    </Row>
                </div>
                <div className="area-passenger-booking">
                    {(availability && availability.pricingCategoryList != null) && availability.pricingCategoryList.nodes.map(value => <AmountPassenger key={value.id} {...{...value, minParticipants: 0} } updatePricingCategoryList={updatePricingCategoryList} /> )}
                    {(availability && availability.pricingCategoryList != null) && <div className="passenger-item"><p className="passenger-type mb-0">Total Price: </p><p
                        className="passenger-price mb-0">{utils.formatCurrency(totalPrice, 'AUD')}</p>
                    </div>}

                </div>
            </Form>
            <Form form={secondStepForm}  style={{ display: step == 1 ? 'block' : 'none' }} layout={"vertical"} id={'form-second-step'} className={"form-step-booking-second"}>
                {Object.keys(inputListFilter.pricingCategoryList).map((value, index) =>{
                    if (inputListFilter.pricingCategoryList[value]){
                        let item = utils.getDataAvailabilityPricingById(availability.pricingCategoryList.nodes, value);
                        if (Object.keys(item).length){
                            let label = item?.label;
                            let passengers = [];
                            let price = utils.formatCurrency(item.unitPrice.gross, item.unitPrice.currency).replaceAll('$', '');
                            price = price.replaceAll('AUD', '');
                            price = price.replaceAll(' ', '');
                            let isChild = (label.toLowerCase().search('child') > -1 || label.toLowerCase().search('infant') > -1);
                            if (!index && leader == '') setLeader(`${ isChild ? 'child' : 'adult'}-${value.replaceAll('-', '')}-1`);
                            for (let i = 1; i <= inputListFilter.pricingCategoryList[value]; i++) passengers.push(`${isChild  ? 'child' : 'adult'}-${value.replaceAll('-', '')}-${i}`)
                            return <div key={uuidv4()}>
                                <p className="title-input-group" key={value}>{label}: <span>{inputListFilter.pricingCategoryList[value]}</span></p>
                                <table className="table-passenger w-100" style={{marginBottom: '10px'}}>
                                    <tbody>
                                    {passengers.map((passenger, indexPassenger) => <tr key={passenger}>
                                        <td style={{width: '7.8%'}}>
                                            <Form.Item name={`${passenger}-title`} style={{minWidth: '80px'}} initialValue={'Mr.'}>
                                                <Select  placeholder="Title" defaultValue="Mr.">
                                                    <Option value="Mr.">Mr.</Option>
                                                    <Option value="Mrs.">Mrs.</Option>
                                                    <Option value="Ms.">Ms.</Option>
                                                    <Option value="Mstr.">Mstr.</Option>
                                                    <Option value="Miss">Miss</Option>
                                                    <Option value="Dr.">Dr.</Option>
                                                    <Option value="Prof.">Prof.</Option>
                                                    <Option value="Sir">Sir</Option>
                                                    <Option value="Lady">Lady</Option>
                                                </Select>
                                            </Form.Item>

                                        </td>
                                        <td style={{width : '10.9%'}}>
                                            <Form.Item name={`${passenger}-firstname`}  rules={[
                                                {
                                                    required: true,
                                                    message: 'Required',
                                                },
                                            ]}>
                                                <Input placeholder="First Name *" />
                                            </Form.Item>
                                        </td>
                                        <td style={{width: '10.9%'}}>
                                            <Form.Item name={`${passenger}-lastname`}  rules={[
                                                {
                                                    required: true,
                                                    message: 'Required',
                                                },
                                            ]}>
                                                <Input  placeholder="Last Name *" />
                                            </Form.Item>
                                        </td>


                                        <td style={{width: '12.5%'}}>
                                            <Form.Item name={`${passenger}-birthday`} rules={[
                                                {
                                                    required: true,
                                                    message: 'Required',
                                                },
                                            ]}>
                                                <DatePicker format="DD/MM/YYYY" placeholder="Date Of Birth" disabledDate={(current) => current >= moment().subtract(1, 'd') } />
                                            </Form.Item>
                                        </td>
                                        <td style={{width: '13.4%'}}>
                                            <Form.Item name={`${passenger}-nationality`} style={{minWidth: '150px'}} rules={[
                                                {
                                                    required: true,
                                                    message: 'Required',
                                                },
                                            ]} >
                                                <Select autoComplete="none"  placeholder={"Nationality *"}  showSearch filterOption={((inputValue, option) => option.key.toLowerCase().includes(inputValue.toLowerCase()))}>
                                                    {countryCodes.map(item => <Option key={item.name}  value={item.name}>{ item.name }</Option>)}
                                                </Select>
                                            </Form.Item>
                                        </td>
                                        {!isChild &&  <td>
                                            <Form.Item name={`${passenger}-email`} rules={[
                                                {
                                                    required: true,
                                                    message: 'Required',
                                                },
                                            ]}>
                                                <Input  placeholder="Email*" />
                                            </Form.Item>
                                        </td>}
                                        {!isChild && <td>
                                            <div className="d-flex">
                                                <Form.Item name={`${passenger}-phonenumber_code`} style={{width: '87px'}} rules={[
                                                    {
                                                        required: true,
                                                        message: 'Required',
                                                    },
                                                ]}>
                                                    <Select placeholder="Code *" autoComplete="none" showSearch filterOption={((inputValue, option) =>
                                                            (option.key.toLowerCase().includes(inputValue.toLowerCase()) || option.value.includes(inputValue))
                                                    )}>
                                                        {countryCodes.map(item => <Option key={item.name}  value={item.dial_code}>{ `${item.dial_code}` }</Option>)}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item name={`${passenger}-phonenumber`} rules={[
                                                    {
                                                        required: true,
                                                        message: 'Required',
                                                    },
                                                ]}>
                                                    <Input  placeholder="Phone Number" />
                                                </Form.Item>
                                            </div>
                                        </td>}

                                        {!isChild && <td>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <input defaultChecked={passenger == leader} onClick={() => {
                                                    setLeader(passenger);
                                                }} id={passenger} type="radio" name="leader" />
                                                <label onClick={() => {
                                                    setLeader(passenger);
                                                }} htmlFor={passenger} style={{marginLeft: '5px'}}>Leader</label>
                                            </div>
                                        </td>}
                                        <td style={{border: 'none', display: `${isChild ? 'inherit' : 'none'}`}}>
                                            <Form.Item name={`${passenger}-price`} hidden={true} initialValue={price}>
                                                <Input  placeholder="Phone Number" />
                                            </Form.Item>
                                            <Form.Item name={`${passenger}-type`} hidden={true} initialValue={label}>
                                                <Input  placeholder="Phone Number" />
                                            </Form.Item>
                                        </td>
                                    </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        }
                        return  <></>
                    }
                })}

            </Form>
            <div className="booking-summary" style={{display: step == 2? 'block' : 'none'}}>
                <p className={'info'}>Product Name: <span>{name}</span></p>
                {valueDefaultDatePicker && <p className={'info'}>Date: <span>{valueDefaultDatePicker.format('dddd DD-MMM-YYYY')}</span></p>}
                <Row>
                    <Col span={6}>
                        {product?.previewImage && <img src={utils.getImageHolibob(product.previewImage.id)} alt=""/>}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={9}>
                        <table className="table-price w-100">
                            <thead>
                                <tr>
                                    <th>Quantity</th>
                                    <th>Price (AUD)</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Object.keys(inputListFilter.pricingCategoryList).map(value =>{
                                if (inputListFilter.pricingCategoryList[value]){
                                    let item = utils.getDataAvailabilityPricingById(availability.pricingCategoryList.nodes, value);
                                    if (Object.keys(item).length){
                                        return <tr key={value}>
                                            <td>{item.label}: {inputListFilter.pricingCategoryList[value]} x {utils.formatCurrency(item.unitPrice.gross, item.unitPrice.currency, 'AUD', false)} </td>
                                            <td>{utils.formatCurrency(item.unitPrice.gross * inputListFilter.pricingCategoryList[value], item.unitPrice.currency, 'AUD', false)}</td>
                                        </tr>
                                    }
                                    return  <></>;
                                }
                            })}
                            <tr>
                                <td></td>
                                <td>  {utils.formatCurrency(totalPrice, 'AUD', 'AUD', false)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                        <Form form={thirdStepForm}>
                            <Form.Item name={'client_note'}>
                                <TextArea placeholder="Note from Client / Agent" rows={6} />
                            </Form.Item>
                        </Form>
                        <Checkbox style={{marginTop: '10px'}} onChange={(e) => {setIsCheckedCheckboxTerm(e.target.checked)}}>I accept the <a style={{color: '#007bff'}}
                            href="https://agentportal.tweetworldtravel.com/terms-conditions" target="_blank">Terms and Conditions*</a></Checkbox>
                        {(isCheckedCheckBoxTerm != null && !isCheckedCheckBoxTerm) && <Alert style={{marginTop: '10px'}} message="Please accept terms
                                    and conditions" type="error" />}

                    </Col>
                </Row>
            </div>
            <div className="booking-payment-options" style={{display: step == 3? 'block' : 'none'}}>
                <p>Please select the payment option/amount below:</p>
                <p className="title-input-group"><strong>SELECT YOUR PAYMENT METHOD</strong></p>
                <Tabs onChange={onChangePaymentMethod} tabPosition="left">
                    <TabPane tab="Electronic Fund Transfer (EFT)" key="1">
                        <Radio.Group onChange={(e) => {
                            setElectronicFundTransfer(e.target.value);
                            if (e.target.value == 2) setIsShowButtonSubmitStepPayment(true)
                            else setIsShowButtonSubmitStepPayment(false);
                        }} value={electronicFundTransfer}>
                            <Radio value={1}>Mint EFT</Radio>
                            <Radio value={2}>Travel Pay EFT</Radio>
                        </Radio.Group>
                        <p style={{marginTop: '25px'}} className={'font-bold'}>Supplier Code: {electronicFundTransfer == 1? 'M309594' : 'TPStweet'}</p>
                    </TabPane>
                    <TabPane tab="Direct Credit" key="2">

                            <p>Please make payments to the below WESTPAC Bank Account</p>
                            <p><strong>Account Name:</strong>Tweet World Travel Tour Operator &amp; Wholesaler Pty. Ltd.
                            </p>
                            <p><strong>BSB:</strong> 035-052</p>
                            <p><strong>Account No.:</strong> 384069</p>
                            <p><strong>International Bank Transfer SWIFT Code:
                                WPACAU2S</strong></p>
                            <p>Please advise payment to: <a href="mailto:contact@tweetworldtravel.com.au">
                                contact@tweetworldtravel.com.au</a></p>
                    </TabPane>
                    <TabPane tab="Pay by PayPal" key="3">
                        <p>All transactions are secure and encrypted with PayPal Checkout</p>
                    </TabPane>
                    <TabPane tab="With Credit Card" key="4">
                        <p>We Accept</p>
                        <img src={paymentMethod} alt=""/>
                        <p style={{marginTop: '25px'}}>All transactions are secure and encrypted.</p>
                    </TabPane>
                </Tabs>
                <p style={{marginTop: '20px'}} className="title-input-group"><strong>SELECT YOUR PAYMENT METHOD</strong></p>
                <Row style={{justifyContent: 'space-around'}} className={'payment-type'}>
                    <Col span={11}>
                        <div className="border-payment mt-3 mb-3">
                            <div id="step4-gross-price-table" className="step4-price-table">
                                <div className="title-table">
                                    {utils.formatCurrency(totalPrice, 'AUD')} gross due
                                </div>
                                <table className="table table-bordered text-center mb-0 w-100">
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Due date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="step4-gross-price-total-net-row">
                                        <th className="text-left">Full</th>
                                        <td>{utils.formatCurrency(totalPrice, 'AUD')}</td>
                                        <td className="step4-total-net-due-date">{moment().format('DD-MMM-YYYY')}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                    <Col span={11}>
                        <div className="border-payment mt-3 mb-3">
                            <div id="step4-gross-price-table" className="step4-price-table">
                                <div className="title-table">
                                    {utils.formatCurrency((totalPrice - (totalPrice * stateAuth.commissionRate / 100)), 'AUD')} net due
                                </div>
                                <table className="table table-bordered text-center mb-0 w-100">
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Due date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="step4-gross-price-total-net-row">
                                        <th className="text-left">Full</th>
                                        <td>{utils.formatCurrency((totalPrice - (totalPrice * stateAuth.commissionRate / 100)), 'AUD')}</td>
                                        <td className="step4-total-net-due-date">{moment().format('DD-MMM-YYYY')}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="success-booking" style={{textAlign: 'center', display: step == 4? 'block' : 'none'}}>
                <img style={{height: '100px'}} src={success} alt=""/>
                <p style={{marginTop: '50px'}}>{`Thank you for choosing Tweet World Travel Tour Operator & Wholesaler. Your booking request reference is: ${bookingInfo?.order_code}`} </p>
                <p>We have received your booking request and it is being processed by our operation team. We will be in touch with you shortly about your booking request.</p>
                <p>For further enquiries, please contact our Head Office via
                    email <a style={{color: '#007bff'}} href="mailto:contact@tweetworldtravel.com.au">contact@tweetworldtravel.com.au
                    </a> or call us on <b>1800 519 631</b></p>
            </div>

        </Spin>

    </Modal>
}

export default ModalBooking;