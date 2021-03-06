import React, { useState, useEffect } from 'react'
import Base from '../core/Base'
import { Link, Redirect } from 'react-router-dom'
import { getCategories, getProduct, updateProduct } from './helper/adminapicall'
import { isAuthenticated } from '../auth/helper'

// TODO : add loading and redirect option
const UpdateProduct = ({ match }) => {

    const { user, token } = isAuthenticated()

    const [values, setValues] = useState({
        name : "",
        description : "",
        price : "",
        stock : "",
        photo : "",
        catergories : [],
        category : "",
        loading : false,
        error : "",
        createdProduct : "",
        getRedirect : false,
        formData : ""
    })

    const { 
        name, 
        description, 
        price, 
        stock, 
        catergories, 
        category, 
        loading, 
        error, 
        createdProduct,
        getRedirect,
        formData
    } = values

    useEffect(() => {
        preload(match.params.productID)
    }, [])

    const preloadCategories = () => {
        getCategories()
            .then(data => {
                if(data.error){
                    setValues({ ...values, error : data.error })
                } else {
                    setValues({ 
                        catergories : data, 
                        formData : new FormData()
                    })
                }
            })
    }

    const preload = (productId) => {
        getProduct(productId)
            .then(data => {
                // console.log(data)
                if(data.error) {
                    setValues({ ...values, error : data.error })
                } else {
                    preloadCategories()
                    setValues({ 
                        ...values,
                        name : data.name,
                        description : data.description,
                        price : data.price,
                        category : data.category._id,
                        stock : data.stock,
                        formData : new FormData(),
                    })
                }
            }).catch( err => {
                console.log(err)
            })
    }


    const onSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, error : "", loading : true })
        updateProduct(match.params.productID , user._id, token, formData)
            .then( data => {
                if(data.error){
                    setValues({ ...values, error : data.error })
                } else {
                    setValues({ 
                        ...values,
                        name : "",
                        description : "",
                        price : "",
                        photo : "",
                        stock : "",
                        loading : false,
                        getRedirect : true, 
                        createdProduct : data.name
                     })
                }
            })
            .catch((err) => {
                console.log(err)
            })
            /*setTimeout(() => {
                return <Redirect to="/admin/dashboard" />
            }, 2000);*/
    }

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value
        formData.set(name, value)
        setValues({ ...values, [name] : value })
    }

    const createProductForm = () => (
        <form >
          <span>Post photo</span>
          <div className="form-group">
            <label className="btn btn-block btn-success">
              <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
          <div className="form-group mt-3">
            <input
              onChange={handleChange("name")}
              name="photo"
              className="form-control"
              placeholder="Name"
              value={name}
              autoFocus
            />
          </div>
          <div className="form-group">
            <textarea
              onChange={handleChange("description")}
              name="photo"
              className="form-control"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group">
            <select
              onChange={handleChange("category")}
              className="form-control"
              placeholder="Category"
            >
              <option>Select</option>
              {catergories && 
                catergories.map((category, index) => (
                    <option key={index} value={category._id}> {category.name} </option>
                ))
              }
            </select>
          </div>
          <div className="form-group">
            <input
            onChange={handleChange("stock")}
            type="number"
            className="form-control"
            placeholder="Stock"
            value={stock}
            />
          </div>
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
            Update Product
          </button>
        </form>
    );

    const successMessage = () => (
        <div className="alert alert-success mt-3" style={{ display: createdProduct ? "" : "none" }} >
            <h4> {createdProduct} updated succesfully :) </h4>
        </div>
    )

    const errorMessage = () => (
        <div className="alert alert-success mt-3" style={{ display: error ? "" : "none" }} >
            <h4> Failed to update product :( </h4>
        </div>
    )

    return (
        <Base
            title="Add a Product here !"
            description="Welcome to Product creation section"
            className="container bg-info p-4"
        >
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3 rounded">Admin Home</Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                    {createProductForm()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateProduct