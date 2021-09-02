import React, { useState } from 'react'
import Base from '../core/Base'
import { isAuthenticated } from '../auth/helper'
import { Link, Redirect } from 'react-router-dom'
import { createCategory } from './helper/adminapicall'

const AddCategory = () => {

    const [name, setName] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const { user, token } = isAuthenticated()

    const goBack = () => {
        return(
            <div className="mt-5">
                <Link className="btn btn-sm btn-success rounded mb-3" to="/admin/dashboard">Admin Home</Link>
            </div>
        )
    }

    const handleChange = (event) => {
        setError("")
        setName(event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setError("")
        setSuccess(false)

        // Backend req fired
        createCategory(user._id, token, {name})
            .then(data => {
                if(data.error) {
                    setError(data.error)
                } else {
                    setError("")
                    setSuccess(true)
                    setName("")
                }
            })
            .catch((err) => {
                console.log(err)
            })
            /*setTimeout(() => {
                return <Redirect to="/admin/dashboard" />
            }, 2000);*/
    }

    const categoryForm = () => {
        return (
            <form action="">
                <div className="form-group">
                    <p className="lead">Enter the category : </p>
                    <input 
                        type="text" 
                        name="" 
                        className="form-control my-3" 
                        autoFocus 
                        required
                        placeholder="For Ex. Summer"
                        onChange={handleChange}
                        value={name}
                    />
                    <button onClick={onSubmit} className="btn btn-outline-info rounded">Create Category</button>
                </div>
            </form>
        )
    }

    const successMessage = () => {
        if(success) {
            return <h4 className="text-success" >Category created successfully :) </h4>
        }
    }

    const warningMessage = () => {
        if(error) {
            return <h4 className="text-danger" >Failed to create category :(</h4>
        }
    }

    return (
        <Base 
            title="Create a Category here" 
            description="Add a new category for new products"
            className="container bg-info p-4"
        >
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {categoryForm()} 
                    {goBack()}
                </div>    
            </div>
        </Base>
    )
}

export default AddCategory