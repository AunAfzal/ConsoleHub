"use client";
import { useState, useEffect } from "react";
const images = [
    'https://article-imgs.scribdassets.com/44ovb083k8c5yej/images/filePXZ3XMRT.jpg',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/31820/ss_8d1e0115107346c62d3a5fbe90be346892ab51b3.600x338.jpg?t=1572992573',
    'https://images.samsung.com/is/image/samsung/assets/us/tvs/gaming-hub/01082024/02_Carousel_REPLAY-Controller.png?imwidth=1536',
    'https://pisces.bbystatic.com/image2/BestBuy_US/dam/1202568_240610_LuigisMansion2FO-XL-a2db82f9-932c-4ac3-b9a7-6565acd9bc40.jpg',
    'https://images.ctfassets.net/ck9jtoelxwa6/4ECQtS4wbX20QxQ3d5qlkA/d8d864eb07ce48593b4929100f62cdc9/ACS_JB_Carousel_Desktop.jpg?fm=webp&f=top&fit=fill&w=4000&h=689',
];

export default function Carousel() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, []);
  return (
    <div>
        <div className="relative w-full max-w-5xl mx-auto mt-6 overflow-hidden">
                <img
                    src={images[currentImageIndex]}
                    alt={`Carousel Image ${currentImageIndex + 1}`}
                    className="w-full h-64 object-cover transition duration-500 ease-in-out"
                />
            </div>
    </div>
  )
}
