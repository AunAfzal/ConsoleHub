"use client"; // This is a client component for dynamic behavior
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Footer from '../components/footer/page';
import Navbar from '../components/navbar/page';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const id = localStorage.getItem('userId');
        const fetchCartItems = async () => {
            if (!id) {
                setCartItems([]);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/carts/get-cart/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCartItems(data.items || []);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setCartItems([]);
            }
        };

        fetchCartItems();
    }, []);

    useEffect(() => {
        totalcost();
    }, [cartItems]);

    const buyCart = async () => {
        try {
            const response = await fetch('http://localhost:4000/carts/buy-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: localStorage.getItem('userId') })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.location.reload();
        } catch (error) {
            console.error('Error buying cart:', error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const response = await fetch('http://localhost:4000/items/remove-from-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: '66797a97058d10f38150b88b', itemId: itemId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setCartItems(prevItems => prevItems.filter(item => item.item._id !== itemId));
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const totalcost = () => {
        let total = 0;
        for (const cartItem of cartItems) {
            const quantity = cartItem.quantity;
            const price = cartItem.item.price;
            const itemTotal = quantity * price;
            total += itemTotal;
        }
        setTotalAmount(total);
    };

    return (
        <main className="min-h-screen bg-gray-100">
            <Navbar/>
            {/* Cart Section */}
            <section className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                <p className="text-lg mb-4">Total items: {cartItems.length}</p>
                <div className="grid grid-cols-1 gap-4 mb-6">
                {cartItems.map(item => (
                    <div className="flex bg-white rounded-lg shadow-md p-4" key={item.item._id}>
                        <Link href={`/itemdetail/${item.item._id}`}>
                            <div className="flex items-center">
                                <img src={item.item.productImage} alt={item.item.name} className="w-40 h-60 object-cover mr-4" />
                                <div className="flex flex-col justify-between w-full">
                                    <div>
                                        <h2 className="text-xl font-bold">{item.item.name}</h2>
                                        <p className="text-gray-700">${item.item.price}</p>
                                        <p className="text-gray-700">{item.item.description}</p>
                                        <p className="text-gray-700"><span className="font-bold">Quantity: </span>{item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <button className="self-end px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => removeFromCart(item.item._id)}>Remove</button>
                    </div>
                ))}
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-2xl font-bold mb-4">Total Amount: ${totalAmount.toFixed(2)}</h2>
                    <button onClick={buyCart} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Place Order</button>
                </div>
            </section>
            <Footer/>
        </main>
    );
};

export default Cart;
