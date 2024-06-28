"use client";
import Footer from '@/app/components/footer/page';
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/navbar/page';

const ItemDetail = ({ params }) => {
  const [item, setItem] = useState(null);
  const id = decodeURIComponent(params.id);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isItemAdded, setIsItemAdded] = useState(false);
  const [displayMsg, setDisplayMsg] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const response = await fetch(`http://localhost:4000/items/${id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setItem(data);
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };

      fetchItem();
    }

    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:4000/users/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            }
          });

          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            console.error('Token verification failed');
          }
        } catch (error) {
          setIsLoggedIn(false);
          console.error('Error verifying token:', error);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    verifyToken();
  }, [id]);

  const addToCart = async (itemid) => {
    if (!isLoggedIn) {
      setDisplayMsg(true);
      setTimeout(() => setDisplayMsg(false), 1000);
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:4000/items/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, itemId: itemid, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Item added to cart:', data);

      // Show item added message for 1 second
      setIsItemAdded(true);
      setTimeout(() => setIsItemAdded(false), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full flex flex-col lg:flex-row">
          <div className="lg:w-1/2 flex justify-center items-center">
            <img src={item.productImage} alt={item.name} className="rounded-lg w-full max-w-xs" />
          </div>
          <div className="lg:w-1/2 lg:pl-10 mt-6 lg:mt-0">
            <h2 className="text-3xl font-bold mb-4">{item.name}</h2>
            <p className="text-gray-700 mb-4">{item.description}</p>
            <p className="text-xl text-green-600 font-semibold mb-6">${item.price.toFixed(2)}</p>
            <button onClick={() => addToCart(item._id)} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />

      {isItemAdded && (
        <div
          className="fixed top-10 right-10 z-50 flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md opacity-75 transition duration-300 ease-in-out"
        >
          Item added to cart!
        </div>
      )}

      {displayMsg && (
        <div
          className="fixed top-10 right-10 z-50 flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md opacity-75 transition duration-300 ease-in-out"
        >
          Please log in to add items to the cart!
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
