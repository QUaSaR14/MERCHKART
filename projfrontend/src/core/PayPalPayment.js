import React, { useState, useEffect }  from 'react'
import DropIn from 'braintree-web-drop-in-react'
import { isAuthenticated } from '../auth/helper'
import { getToken, processPayment } from './helper/paymentPaypalHelper'
import { emptyCart } from './helper/cartHelper'
import { createOrder } from './helper/orderHelper'

const PayPalPayment = ({ 
    products, 
    setReload = f => f,
    reload = undefined 
}) => {

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const [info, setInfo] = useState({
        loading : false,
        success : false,
        clientToken : null, 
        error : "",
        instance : {}
    })

    const getNewToken = (userId, token) => {
        getToken(userId, token)
            .then( info => {
                // console.log("Info : ", info)
                if(info.error) {
                    setInfo({ ...info, error: info.error })
                } else {
                    const clientToken = info.clientToken
                    setInfo({ clientToken : clientToken })
                }
            })
            .catch()
    }

    useEffect(() => {
        getNewToken(userId, token)
    }, [])

    const showDropIn = () => {
        return(
            <div>
                { info.clientToken !== null && products.length  ? (
                    <div>
                        <DropIn
                        options={{ authorization: info.clientToken }}
                        onInstance={(instance) => (info.instance = instance)}
                        />
                        <button className="btn btn-success btn-block" onClick={onPurchase}>Buy</button>
                    </div>
                ) : (
                    <h3>Please Login or add somthing to Cart</h3>
                ) }
            </div>
        )
    }

    const onPurchase = () => {
        setInfo({ loading : true })
        let nonce
        let getNonce = info.instance
            .requestPaymentMethod()
            .then( data => {
                nonce = data.nonce
                const paymentData = {
                    paymentMethodNonce : nonce,
                    amount : calcAmount()
                }
                processPayment(userId, token, paymentData)
                    .then(response => {
                        setInfo({ ...info, success : response.success, loading : false })
                        console.log("PAYMENT SUCCESSFULL :) ")
                        const orderData = {
                            products : products,
                            transaction_id : response.transaction.id,
                            amount : response.transaction.amount
                        }
                        createOrder(userId, token, orderData)
                        emptyCart(() => {
                            console.log("Did we got a crash !!")
                        })
                        setReload(!reload)
                    })
                    .catch(err => {
                        setInfo({ loading : false, success : false })
                        console.log("PAYMENT FAILED :/ ")
                    })
            })
            .catch()
    }

    const calcAmount = () => {
        let amount = 0
        products.map((product, index) => {
            amount = amount + product.price
        })
        return amount
    }

    return (
        <div>
            <h3>Your bill is : &#8377; {calcAmount()}</h3>
            {showDropIn()}
        </div>
    )
}

export default PayPalPayment
