import React, { useState, useEffect } from 'react';
import './Header.scss';

const Header = () => {
    const images = [
        {
            src: '/header_img.png',
            heading: 'Order your favourite food here',
            paragraph: 'Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise, one delicious meal at a time.',
            buttonColor: 'rgba(0, 0, 0, 0.75)',
            buttonLink: '/foodmenu',
        },
        {
            src: '/header_img2.png',
            heading: 'Discover a world of healthy flavors',
            paragraph: 'Explore our menu filled with nutritious and delicious options that cater to your health and taste buds.',
            buttonColor: '#4caf50',
            buttonLink: '/healthymenu',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-switch images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    // Handle manual navigation with smart cycle buttons
    const handleButtonClick = (index) => {
        setCurrentIndex(index);
    };

    // Handle "View Menu" button click
    const handleViewMenuClick = () => {
        window.location.href = images[currentIndex].buttonLink;
    };

    return (
        <div className='header'>
            <div
                className="header-background"
                style={{ backgroundImage: `url(${images[currentIndex].src})` }}
            ></div>

            <div className="header-contents">
                <h2>{images[currentIndex].heading}</h2>
                <p>{images[currentIndex].paragraph}</p>
                <button
                    style={{ backgroundColor: images[currentIndex].buttonColor }}
                    onClick={handleViewMenuClick}
                >
                    View Menu
                </button>
            </div>

            <div className="smart-cycle-buttons">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={index === currentIndex ? 'active' : ''}
                        onClick={() => handleButtonClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Header;