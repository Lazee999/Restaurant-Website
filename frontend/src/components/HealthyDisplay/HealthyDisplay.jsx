import React, { useContext } from 'react';
import './HealthyDisplay.scss';
import { StoreContext } from '../../context/StoreContext';
import HealthyFoodItem from '../HealthyFoodItem/HealthyFoodItem';

const HealthyDisplay = ({ categoryhealth }) => {
    const { healthy_food } = useContext(StoreContext);

    return (
        <div className="healthy-display" id="healthy-display">
            <h2>Where healthy meets heavenly, feed your soul.</h2>
            <div className="healthy-display-list">
                {healthy_food
                    ?.filter((item) =>
                        categoryhealth === 'All' || item.category === categoryhealth
                    )
                    .map((item) => (
                        <HealthyFoodItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                        />
                    ))}
            </div>
            <hr />
        </div>
    );
};

export default HealthyDisplay;
