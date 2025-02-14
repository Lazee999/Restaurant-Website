import React, { useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Verify.scss';

const Verify = () => {
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const { url } = useContext(StoreContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                if (!orderId || success === null) {
                    throw new Error('Missing parameters');
                }

                const storedToken = localStorage.getItem('token');

                const response = await axios.post(
                    `${url}/api/order/verify`,
                    {
                        orderId,
                        success
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': storedToken
                        }
                    }
                );

                if (response.data.success) {
                    localStorage.removeItem('cartItems');
                    toast.success('Payment successful! Redirecting to orders...');
                    setTimeout(() => navigate('/myorders'), 2000);
                } else {
                    toast.error(response.data.message || 'Payment failed');
                    setTimeout(() => navigate('/'), 2000);
                }
            } catch (error) {
                console.error('Verification error:', error);
                const errorMessage = error.response?.data?.message || 'Payment verification failed';
                toast.error(errorMessage);
                setTimeout(() => navigate('/'), 2000);
            } finally {
                setIsLoading(false);
            }
        };

        verifyPayment();
    }, [orderId, success, navigate, url]);

    return (
        <div className="verify-container">
            <div className="verify-card">
                <div className="verify-content">
                    {isLoading ? (
                        <>
                            <div className="loading-spinner" />
                            <p className="loading-text">Verifying your payment...</p>
                        </>
                    ) : (
                        <>
                            <div className={`status-icon ${success === 'true' ? 'success' : 'error'}`}>
                                {success === 'true' ? (
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                )}
                            </div>
                            <h2 className={`status-title ${success === 'true' ? 'success' : 'error'}`}>
                                {success === 'true' ? 'Payment Successful!' : 'Payment Failed'}
                            </h2>
                            <p className="status-message">
                                {success === 'true'
                                    ? 'Redirecting to your orders...'
                                    : 'Redirecting to home...'}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Verify;

