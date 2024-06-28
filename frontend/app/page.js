"use client";
import Carousel from "./components/carousel/page";
import Section from "./components/section/page";
import Footer from "./components/footer/page";
import Navbar from "./components/navbar/page";
import { useState, useEffect } from "react";

export default function HomePage() {
    const [games, setGames] = useState([]);
    const [accessories, setAccessories] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch('http://localhost:4000/items/some?category=game');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGames(data);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        const fetchAccessories = async () => {
            try {
                const response = await fetch('http://localhost:4000/items/some?category=accessory');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAccessories(data);
            } catch (error) {
                console.error('Error fetching accessories:', error);
            }
        };

        fetchGames();
        fetchAccessories();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100">
            <Navbar/>
            {/* Carousel */}
            <Carousel/>
            
            {/* Games Section */}
            <section className="mt-10 container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-4">Games</h2>
                <Section items={games} />
            </section>

            {/* Accessories Section */}
            <section className="mt-10 container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-4">Accessories</h2>
                <Section items={accessories} />
            </section>
            <Footer/>
        </main>
    );
}
