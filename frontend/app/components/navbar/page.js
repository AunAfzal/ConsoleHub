'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const Use = {
    profilePicture: '/user.png', // Replace with the actual path or a dynamic source
    name: 'John Doe',
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(Use);
  const router = useRouter();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      const encodedValue = encodeURIComponent(searchTerm.trim());
      router.push(`/search/${encodedValue}`);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isSeller');
    setIsLoggedIn(false);
  };



  useEffect(() => {
    const fetchUser = async () => {
      const id = localStorage.getItem('userId');
      try {
        const response = await fetch(`http://localhost:4000/users/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        //set picture and name
        setUser({
          profilePicture: data.profilePicture || '/user.png',
          name: data.name,
        });
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:4000/users/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          });

          const data = await response.json();
          if (data.message === "Valid token") {
            console.log(data.message);
            setIsLoggedIn(true);
            fetchUser();
          } else {
            setIsLoggedIn(false);
            console.error('Token verification failed:', data.message);
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
  }, []);

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <span className="text-2xl font-bold cursor-pointer">
              ConsoleHub
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Right Side (Conditional) */}
        <div className="flex items-center flex-wrap space-x-0 sm:space-x-4 relative">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <Image
                  src={user.profilePicture}
                  alt={`${user.name} Profile`}
                  width="100"
                  height="100"
                  className="h-10 w-10 rounded-full object-cover cursor-pointer ml-2 sm:ml-4"
                />
                <p>{user.name}</p>
              </div>
              <Link href="/cart">
                <Image
                  src="/cart.png"
                  alt="Cart"
                  width="100"
                  height="100"
                  className="h-6 w-6 cursor-pointer ml-2 sm:ml-4"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
                  Login
                </span>
              </Link>
              <Link href="/register">
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Register as Seller
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
