import { useState, useEffect } from "react"
import { productService } from "../../services/productService"
import { Trash2, Plus, Package, IndianRupee, Link as LinkIcon } from "lucide-react"
import { Link } from "react-router-dom"

const Dashboard = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const data = await productService.getProducts()
            setProducts(data)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.deleteProduct(id)
                setProducts(products.filter(p => p.id !== id))
            } catch (error) {
                alert("Error deleting product")
            }
        }
    }

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                        <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-subtext">Total Products</p>
                        <p className="text-2xl font-bold">{loading ? '...' : products.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                        <IndianRupee className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                        <p className="text-sm text-subtext">Store Value</p>
                        <p className="text-2xl font-bold">
                            ₹{loading ? '...' : products.reduce((acc, p) => acc + Number(p.price), 0)}
                        </p>
                    </div>
                </div>
                <Link
                    to="/admin/add"
                    className="bg-primary p-6 rounded-xl shadow-sm flex items-center justify-center gap-4 hover:bg-secondary transition-colors text-white"
                >
                    <Plus className="w-6 h-6" />
                    <span className="text-lg font-bold">Add New Product</span>
                </Link>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Manage Products</h3>
                    <span className="text-sm text-subtext">{products.length} Products</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f9fafb] text-sm uppercase font-semibold text-subtext">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-subtext">Loading products...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-subtext">No products added yet.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="font-semibold text-text">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-text">₹{product.price}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
