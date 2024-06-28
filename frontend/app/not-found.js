// pages/404.js
"use client";

import Link from 'next/link';

const Custom404 = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-2xl mb-4">Oops! Page Not Found</p>
                <p className="text-gray-700 mb-8">
                    Sorry, the page you are looking for does not exist. You can go back to the homepage or explore other parts of the site.
                </p>
                <Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        Go to Home
                </Link>
            </div>
        </div>
    );
};

export default Custom404;
