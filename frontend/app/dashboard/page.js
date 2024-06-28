"use client";
import { useEffect, useState } from "react";
import SellerNavbar from "../components/sellerNavbar/page";
import PrivateRoute from "../components/Privateroute";
 
const Dashboard = () => {
    const [recentSales, setRecentSales] = useState([]);
    const [seller, setSeller] = useState({});
    const [totalSales, setTotalSales] = useState(0);
    const [totalListed, setTotalListed] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:4000/orders/some-orders/?sellerId=${seller._id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRecentSales(data);
            } catch (error) {
                console.error('Error fetching recent sales:', error);
            }
        };

        const fetchUser = async () => {
            const id = localStorage.getItem('userId');
            try {
                const response = await fetch(`http://localhost:4000/users/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSeller(data);
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };

        const fetchTotalSales = async () => {
            try {
                const response = await fetch('http://localhost:4000/users/getTotalSales', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: localStorage.getItem('userId') }),
                });
                const data = await response.json();
                setTotalSales(data.totalSales);
            } catch (error) {
                console.error('Error fetching total sales:', error);
            }
        };

        const fetchTotalListed = async () => {
            try {
                const response = await fetch('http://localhost:4000/users/getProductListed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: localStorage.getItem('userId') }),
                });
                const data = await response.json();
                setTotalListed(data.totalListed);
            } catch (error) {
                console.error('Error fetching total listed:', error);
            }
        };

        fetchUser();
        fetchOrders();
        fetchTotalSales();
        fetchTotalListed();
    }, [seller._id]);

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-100 flex">
                <SellerNavbar />
                <main className="flex-grow p-10 ml-16 md:ml-48">
                    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-2xl font-bold mb-4">Welcome, {seller.name ? seller.name : "John Doe"}</h2>
                        <p className="text-lg mb-2">Total Products Listed: {totalListed}</p>
                        <p className="text-lg mb-4">Total Sales: {totalSales}</p>
                        <h3 className="text-xl font-bold mb-2">Recent Sales</h3>
                        <ul>
                            {recentSales.length > 0 ? (
                                recentSales.map((sale, index) => (
                                    <li key={index} className="text-gray-700 mb-2">Date: {new Date(sale.soldAt).toLocaleDateString()} - Amount: ${sale.totalAmount}</li>
                                ))
                            ) : (
                                <p>No sales to show</p>
                            )}
                        </ul>
                    </div>
                </main>
            </div>
        </PrivateRoute>
    );
};

export default Dashboard;
