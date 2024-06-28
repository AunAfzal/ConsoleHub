// components/SellerNavbar.js
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to get current path
import { useRouter } from 'next/navigation';

const SellerNavbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', icon: '🏠', path: '/dashboard' },
        { name: 'Orders', icon: '📦', path: '/orders' },
        { name: 'Products', icon: '🛒', path: '/products' },
    ];

    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isSeller');
        router.push('/signin');
      };
 
    return (
        <nav className="fixed top-0 left-0 h-full w-16 md:w-48 bg-gray-800 text-white flex flex-col items-center py-8 space-y-6">
            {navItems.map((item) => (
                <Link href={item.path} key={item.name}>
                    <div className={`flex flex-col md:flex-row items-center p-4 md:p-2 rounded-lg cursor-pointer hover:bg-gray-700 ${pathname === item.path ? 'bg-gray-700' : ''}`}>
                        <span className="text-lg md:mr-4">{item.icon}</span>
                        <span className="hidden md:inline">{item.name}</span>
                    </div>
                </Link>
            ))}
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
        </nav>
    );
};

export default SellerNavbar;
