import {useEffect, useState} from "react";
import utils from '../../utils/index'
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {message} from "antd";

const AmountPassenger = (props) => {
    const {label, unitPrice, maxParticipants, minParticipants, updatePricingCategoryList, id, maxParticipantsDepends} = props;
    const [amount, setAmount] = useState(minParticipants);
    const [totalPrice, setTotalPrice] = useState(unitPrice.gross * amount);

    useEffect(() => {
        updatePricingCategoryList(id, amount);
    }, []);

    useEffect(() => {
        setTotalPrice(unitPrice.gross * amount)
    }, [props])

    const addPassenger = label => {
        let amountPassenger = amount + 1;
        if (amountPassenger <= maxParticipants) {
            setAmount(amountPassenger);
            setTotalPrice(amountPassenger * unitPrice.gross);
            updatePricingCategoryList(id, amountPassenger);
        } else {
            message.error(`Maximum number of ${label} is ${maxParticipants}`)
        }

    }

    const decreasePassenger = label => {
        let amountPassenger = amount - 1;
        if (amountPassenger >= minParticipants) {
            setAmount(amountPassenger);
            setTotalPrice(amountPassenger * unitPrice.gross);
            updatePricingCategoryList(id, amountPassenger);
        } else {
            message.error(`Minimum number of ${label} is ${minParticipants}`)
        }

    }


    return (unitPrice.gross ? <div className="box-passenger">
        <div className="passenger-item">
            <p className="passenger-type mb-0">{label}</p>
            <p className="passenger-price mb-0">{utils.formatCurrency(totalPrice, unitPrice.currency)}</p>
            <div className="action">
                <MinusOutlined onClick={() => decreasePassenger(label)}/>
                <span>{amount}</span>
                <PlusOutlined onClick={() => addPassenger(label)}/>
            </div>
        </div>
        <div className="explanation">
            {maxParticipantsDepends != null && maxParticipantsDepends.map( (value, index) => <span style={{display: "block"}} key={index}>{value.explanation}</span> )}
        </div>
    </div> : <></>)
}

export default AmountPassenger;