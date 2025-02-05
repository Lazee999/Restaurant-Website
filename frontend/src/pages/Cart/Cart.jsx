import React, { useContext } from 'react'
import './Cart.scss'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

    const { cartItems, food_list, healthy_food, removeFromCart, getTotalCartAmount } = useContext(StoreContext);

    const navigate = useNavigate();

    const allFoodItems = [...food_list, ...healthy_food];

    return (
        <div className='cart'>
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Item </p>
                    <p>Title </p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total </p>
                    <p>Remove </p>
                </div>
                <br />
                <hr />
                {allFoodItems.map((item, index) => {
                    if (cartItems[item._id] > 0) {
                        console.log(item.image);
                        return (
                            <div className="hi" key={index}>
                                <div className="cart-items-title cart-items-item">
                                    <img src={item.image} alt="" />
                                    <p>{item.name}</p>
                                    <p>${item.price}</p>
                                    <p>{cartItems[item._id]}</p>
                                    <p>${item.price * cartItems[item._id]}</p>
                                    <p onClick={() => removeFromCart(item._id)} className='cross'>x </p>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                })}

            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal:</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <div className="cart-total-details">
                            <p> Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 1}</p>
                        </div>
                        <div className="cart-total-details">
                            <p> Total</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 1}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate("/order")}> PROCEED TO CHECKOUT</button>
                </div>

                <div className="cart-promocode">
                    <div>
                        <p>If you have a promocode, Enter it here</p>
                        <div className="cart-promocode-input">
                            <input type="text" placeholder="promo code" />
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
