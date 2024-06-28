"use client";
import { useState, useEffect } from 'react';
import Item from '../item/page';

const Section = ({ items }) => {
    const [startIndex, setStartIndex] = useState(0);
    const [visibleItemsToShow, setVisibleItemsToShow] = useState(5);

    useEffect(() => {
        const calculateVisibleItems = () => {
            if (window.innerWidth > 1200) {
                setVisibleItemsToShow(5);
            } else if (window.innerWidth > 800) {
                setVisibleItemsToShow(4);
            } else if (window.innerWidth > 600) {
                setVisibleItemsToShow(3);
            } else if (window.innerWidth > 400) {
                setVisibleItemsToShow(2);
            } else {
                setVisibleItemsToShow(1);
            }
        };

        calculateVisibleItems();
        window.addEventListener('resize', calculateVisibleItems);

        return () => window.removeEventListener('resize', calculateVisibleItems);
    }, []);


    const handleScrollLeft = () => {
        setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleScrollRight = () => {
        setStartIndex((prevIndex) => Math.min(prevIndex + 1, items.length - 5));
    };

    const visibleItems = items.slice(startIndex, startIndex + visibleItemsToShow);

    return (
        <div className="relative w-full">
            {/* Left Scroll Button */}
            <button 
                onClick={handleScrollLeft} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
                style={{ display: startIndex === 0 ? 'none' : 'block' }} // Hide button if at the start
            >
                &#8249;
            </button>

            <div className="flex overflow-hidden space-x-4">
                {visibleItems.map((item) => (
                    <div key={item._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                        <Item item={item} />
                    </div>
                ))}
            </div>
            {/* Right Scroll Button */}
            <button 
                onClick={handleScrollRight} 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
                style={{ display: startIndex >= items.length - 5 ? 'none' : 'block' }} // Hide button if at the end
            >
                &#8250;
            </button>
        </div>
    );
};

export default Section;
