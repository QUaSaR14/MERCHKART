import React, { useState, useEffect } from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import { getCategories } from './helper/adminapicall'
import { isAuthenticated } from '../auth/helper'

// Assignment : Complete delete and update features
const ManageCategories = () =>  {

    const { user, token } = isAuthenticated()

    const [catergories, setCategories] = useState([])

    const preload = () => {
        getCategories()
            .then( data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    // console.log(data)
                    setCategories(data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        preload()
    }, [])

    const deleteCategory = () => {
        // 
    }

    return (
        <Base title="Welcome admin" description="Manage products here">
            <h2 className="mb-4">All products:</h2>
            <Link className="btn btn-info" to={`/admin/dashboard`}>
                <span className="">Admin Home</span>
            </Link>
            <div className="row">
                <div className="col-12">
                <h2 className="text-center text-white my-3 pb-2">Total {catergories.length} catergories</h2>
                {catergories.map((catergory, index) => {
                    return (
                        <div key={index} className="row text-center mb-2 ">
                            <div className="col-4">
                                <h3 className="text-white text-left"> {catergory.name} </h3>
                            </div>
                            <div className="col-4">
                                <Link
                                    className="btn btn-success"
                                    to={`/admin/product/update/productId`}
                                >
                                    <span className="">Update</span>
                                </Link>
                            </div>
                            <div className="col-4">
                                <button onClick={() => {}} className="btn btn-danger">
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
        </Base>   
    )
}

export default ManageCategories
