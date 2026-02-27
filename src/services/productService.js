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

    async addProduct(product, imageFiles) {
        const formData = new FormData()
        formData.append('name', product.name)
        formData.append('price', product.price)
        formData.append('description', product.description)
        if (product.category) formData.append('category', product.category)
        const files = Array.isArray(imageFiles) ? imageFiles : (imageFiles ? [imageFiles] : [])
        files.forEach((f) => formData.append('image', f))
        const response = await axios.post(`${API_URL}/products`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    async updateProduct(id, product, imageFile) {
        const formData = new FormData()
        if (product.name !== undefined) formData.append('name', product.name)
        if (product.price !== undefined) formData.append('price', product.price)
        if (product.description !== undefined) formData.append('description', product.description)
        if (product.category !== undefined) formData.append('category', product.category)
        if (imageFile) formData.append('image', imageFile)
        const response = await axios.patch(`${API_URL}/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    async deleteProduct(id) {
        await axios.delete(`${API_URL}/products/${id}`)
    }
}
