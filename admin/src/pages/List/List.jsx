import React from 'react';
import './List.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const List = ({ url }) => {
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState('All');

    const fetchList = async () => {
        const mainFoodResponse = await axios.get(`${url}/api/food/list`);
        const healthyFoodResponse = await axios.get(`${url}/api/healthyfood/list`);

        if (mainFoodResponse.data.success && healthyFoodResponse.data.success) {
            const combinedList = [
                ...mainFoodResponse.data.data.map(item => ({ ...item, productCategory: 'Main Food' })),
                ...healthyFoodResponse.data.data.map(item => ({ ...item, productCategory: 'Healthy Food' }))
            ];
            setList(combinedList);
        } else {
            toast.error("Error fetching food items");
        }
    };

    const removeFood = async (foodId, productCategory) => {
        const endpoint = productCategory === 'Healthy Food'
            ? `${url}/api/healthyfood/remove`
            : `${url}/api/food/remove`;

        const response = await axios.post(endpoint, { id: foodId });
        await fetchList();

        if (response.data.success) {
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const filteredList = filter === 'All'
        ? list
        : list.filter(item => item.productCategory === filter);

    return (
        <div className="list add flex-col">
            <div className="filter-section">
                <select
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                >
                    <option value="All">All Products</option>
                    <option value="Main Food">Main Food</option>
                    <option value="Healthy Food">Healthy Food</option>
                </select>
            </div>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Product Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {filteredList.map((item, index) => (
                    <div
                        key={index}
                        className={`list-table-format ${item.productCategory === 'Main Food' ? 'main-food' : 'healthy-food'}`}
                    >
                        <img src={`${url}/images/` + item.image} alt="" />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{item.productCategory}</p>
                        <p>${item.price}</p>
                        <p onClick={() => removeFood(item._id, item.productCategory)} className="cursor">X</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default List;













