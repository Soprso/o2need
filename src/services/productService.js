import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export const productService = {
    async getProducts() {
        const response = await axios.get(`${API_URL}/products`)
        return response.data
    },

    async getProductById(id) {
        const response = await axios.get(`${API_URL}/products/${id}`)
        return response.data
    },

    async addProduct(product, imageFile) {
        const formData = new FormData()
        formData.append('name', product.name)
        formData.append('price', product.price)
        formData.append('description', product.description)
        if (imageFile) {
            formData.append('image', imageFile)
        }

        const response = await axios.post(`${API_URL}/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    async deleteProduct(id) {
        await axios.delete(`${API_URL}/products/${id}`)
    }
}
