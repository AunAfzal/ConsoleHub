'use client';
import SellerNavbar from "../components/sellerNavbar/page";
import { useState, useEffect } from 'react';
import PrivateRoute from "../components/Privateroute";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: 'game',
        image: null,
    });
    const [message, setMessage] = useState('');
    const [seller, setSeller] = useState(null);

    useEffect(() => {
        const fetchSeller = async () => {
            const id = localStorage.getItem('userId');
            try {
                const response = await fetch(`http://localhost:4000/users/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSeller(data);
            } catch (error) {
                console.error('Error fetching seller:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:4000/items/some?seller=${seller._id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchSeller();
        fetchProducts();
    }, [seller]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };    

    const handleFileChange = (e) => {
        setNewProduct({ ...newProduct, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (newProduct.category !== "game" && newProduct.category !== "accessory") {
            setMessage('Please select a valid category (Game or Accessory).');
            return;
        }
    
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('quantity', newProduct.quantity);
        formData.append('category', newProduct.category);
        formData.append('seller', seller._id);
        formData.append('productImage', newProduct.image);
    
        try {
            const response = await fetch('http://localhost:4000/items/add', {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setProducts([...products, data]);
            setShowAddProductForm(false);
            setMessage('Product added successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage('Error adding product. Please try again.');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://localhost:4000/items/some?seller=${seller._id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-100 flex">
                <SellerNavbar />
                <main className="flex-grow p-10 ml-16 md:ml-48">
                    <h1 className="text-3xl font-bold mb-6">Products</h1>
                    {message && (
                        <div className="mb-4 p-4 text-white bg-green-500 rounded-lg">
                            {message}
                        </div>
                    )}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="mb-4 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Search products"
                                className="p-2 border border-gray-300 rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                onClick={() => setShowAddProductForm(true)}
                            >
                                Add New Product
                            </button>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b py-2">Product Image</th>
                                    <th className="border-b py-2">Name</th>
                                    <th className="border-b py-2">Price</th>
                                    <th className="border-b py-2">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product._id}>
                                        <td className="border-b py-2">
                                            <img src={product.productImage} alt={product.name} className="h-16 w-16 object-cover rounded-lg" />
                                        </td>
                                        <td className="border-b py-2">{product.name}</td>
                                        <td className="border-b py-2">${product.price.toFixed(2)}</td>
                                        <td className="border-b py-2">{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {showAddProductForm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4 md:mx-0 md:w-1/2 max-h-full overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block mb-2">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            value={newProduct.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Product Description (optional)</label>
                                        <textarea
                                            name="description"
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            value={newProduct.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block mb-2">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            value={newProduct.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            value={newProduct.quantity}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Category</label>
                                        <select
                                            name="category"
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            value={newProduct.category}
                                            onChange={handleInputChange}
                                        >
                                            <option value="game">Game</option>
                                            <option value="accessory">Accessory</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2">Upload Product Image</label>
                                        <input
                                            type="file"
                                            name="image"
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mr-4"
                                            onClick={() => setShowAddProductForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </PrivateRoute>
    );
};

export default Products;
