"use client";

import SellerNavbar from "../components/sellerNavbar/page";
import { useState, useEffect } from 'react';
import PrivateRoute from "../components/Privateroute";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('All');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [seller, setSeller] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:4000/orders/all-orders?sellerId=${seller._id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

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
        fetchSeller();
        fetchOrders();
    }, [seller]);

    const confirmOrder = async (orderId) => {
        try {
            const response = await fetch('http://localhost:4000/orders/confirm-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, orderStatus: 'Confirmed' } : order
            ));
            setConfirmationMessage('Order confirmed');
            setTimeout(() => setConfirmationMessage(''), 3000);
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(order => order.orderStatus === filter);

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-100 flex">
                <SellerNavbar />
                <main className="flex-grow p-10 ml-16 md:ml-48">
                    <h1 className="text-3xl font-bold mb-6">Orders</h1>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <label className="block mb-2">Filter by status:</label>
                        <select className="mb-4 p-2 border border-gray-300 rounded-lg" value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                        </select>
                        {confirmationMessage && <div className="text-green-500">{confirmationMessage}</div>}
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b py-2">Order ID</th>
                                    <th className="border-b py-2">Customer Name</th>
                                    <th className="border-b py-2">Items Ordered</th>
                                    <th className="border-b py-2">Order Total</th>
                                    <th className="border-b py-2">Order Status</th>
                                    <th className="border-b py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order._id}>
                                        <td className="border-b py-2">{order._id}</td>
                                        <td className="border-b py-2">{order.user.name}</td>
                                        <td className="border-b py-2">{order.items.length}</td>
                                        <td className="border-b py-2">${order.totalAmount}</td>
                                        <td className="border-b py-2"> {order.orderStatus}</td>
                                        <td className="border-b py-2">
                                            {order.orderStatus === 'Pending' && (
                                                <button onClick={() => confirmOrder(order._id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                                    Confirm
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </PrivateRoute>
    );
};

export default Orders;
