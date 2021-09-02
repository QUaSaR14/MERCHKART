import React from 'react'
import { API } from '../../backend'


const ImageHelper = ({ product }) => {

    const imageURL = product ? 
        `${API}/product/photo/${product._id}` : 
        `https://images.pexels.com/photos/945966/pexels-photo-945966.jpeg?cs=srgb&dl=dream-big-signage-945966.jpg&fm=jpg`

    return (
        <div className="rounded border border-success p-2">
            <img
            src={imageURL}
            alt="photo"
            style={{ maxHeight: "100%", maxWidth: "100%" }}
            className="mb-3 rounded"
            />
        </div>
    )
}

export default ImageHelper
