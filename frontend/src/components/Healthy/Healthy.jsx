import React from 'react';
import './Healthy.scss';
import { healthy_menu_list } from '../../assets/assets';

const Healthy = ({ categoryhealth, setCategoryHealth }) => {
    return (
        <div className="healthy" id="healthy">
            <h1>Healthy Menu</h1>
            <p className="healthy-description">
                Choose from our specially curated healthy dishes crafted with fresh and wholesome ingredients.
            </p>
            <div className="healthy-menu-list">
                {healthy_menu_list.map((item, index) => (
                    <div
                        key={index}
                        className={`healthy-menu-list-item ${categoryhealth === item.menu_name ? 'active' : ''}`}
                        onClick={() =>
                            setCategoryHealth((prev) =>
                                prev === item.menu_name ? 'All' : item.menu_name
                            )
                        }
                    >
                        <img
                            className={categoryhealth === item.menu_name ? 'active' : ''}
                            src={item.menu_image}
                            alt={item.menu_name}
                        />
                        <p>{item.menu_name}</p>
                    </div>
                ))}
            </div>
            <hr />
        </div>
    );
};

export default Healthy;
