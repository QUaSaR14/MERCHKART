import React, { useState, useEffect } from 'react'
import "../styles.css"
import Base from './Base'
import Card from './Card'
import { loadCart } from './helper/cartHelper'
import PayPalPayment from './PayPalPayment'

export default function Cart() {
    
    const [products, setProducts] = useState([])
    const [reload, setReload] = useState(false)

    useEffect(() => {
        setProducts(loadCart())
    }, [reload])

    const loadAllProducts = (products) => {
        return (
            <div>
                <h2>
                    This section is to load products
                </h2>
                {products.map((product, index) => {
                    return(
                        <Card 
                            key={index} 
                            product={product} 
                            addToCart={false}
                            removeFromCart={true}
                            setReload={setReload}
                            reload={reload}
                        />
                    )
                })}
            </div>
        )
    }

    return (
        <Base title="Cart Page" description="Ready to checkout ?">
            <div className="row text-center">
                <div className="col-6">
                    { products.length > 0 ? loadAllProducts(products) : (
                        <h3>Cart is Empty ... </h3>
                    )}
                </div>
                <div className="col-6">
                    <PayPalPayment products={products} setReload={setReload} />
                </div>
            </div>
        </Base>
    )
}
