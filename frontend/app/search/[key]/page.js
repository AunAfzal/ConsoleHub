"use client";
import Navbar from "@/app/components/navbar/page";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const SearchPage = ({ params }) => {
    const key = decodeURIComponent(params.key);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`http://localhost:4000/items/search?search=${key}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        if (key) {
            fetchItems();
        }
    }, [key]);

    // Filter the items based on the search key
    const filteredItems = items.filter((item) =>
        key ? item.name.toLowerCase().includes(key.toLowerCase()) : false
    );

    return (
        <main className="min-h-screen bg-gray-100">
            <Navbar/>
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-6">Search Results for "{key}"</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <Link href={`/itemdetail/${item._id}`}>
                            <div key={item._id} className="flex bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition transform hover:scale-105">
                                <div className="w-1/3">
                                    <img src={item.productImage} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                </div>
                                <div className="w-2/3 pl-4">
                                    <h2 className="text-xl font-bold">{item.name}</h2>
                                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            </Link>
                        ))
                    ) : (
                        <p>No items found for "{key}"</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default SearchPage;
