import React from 'react'
import './Footer.scss'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p>
                        Minchi Minchi Restaurant is dedicated to serving delicious and authentic cuisine, crafted with the finest ingredients. We strive to create a warm and inviting atmosphere where customers can enjoy flavorful dishes and exceptional service. Whether you're dining in or ordering online, we ensure a delightful culinary experience every time.
                    </p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>Restaurant</h2>
                    <ul>
                        <li>Home</li>
                        <li>about us</li>
                        <li>Healthy</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>


                </div>
                <div className="footer-content-right">
                    <h2> GET IN TOUCH</h2>
                    <ul>
                        <li> +94-71-504-8131</li>
                        <li> minchi@restarant </li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'> Copyright  2025 © Minchi.com - All rights reserved.     </p>

        </div>
    )
}

export default Footer