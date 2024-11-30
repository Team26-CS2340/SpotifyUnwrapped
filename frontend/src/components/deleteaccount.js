import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const DeleteAccount = () => {
    const navigate = useNavigate();
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];

            const response = await fetch('/api/delete-account', {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            localStorage.clear();
            navigate('/');
        } catch (err) {
            setError('Failed to delete account. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];
    
            const response = await fetch('/api/logout/', {  // Added leading and trailing slash
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': token
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
    
            localStorage.clear();
            navigate('/');
        } catch (err) {
            setError('Failed to logout. Please try again.');
        }
    };

    return (
        <Layout>
            <div className="flex justify-center items-center min-h-[calc(100vh-90px)] bg-[var(--bg-primary)] p-6">
                <div className="bg-[var(--bg-secondary)] p-8 rounded-lg max-w-md w-full shadow-lg">
                    <h1 className="text-[var(--text-primary)] text-3xl font-bold mb-6 text-center">
                        Account Settings
                    </h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {!isConfirming ? (
                        <div className="space-y-6">
                            <p className="text-[var(--text-primary)] mb-4">
                                What would you like to do with your account?
                            </p>
                            <div className="flex flex-col space-y-4">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full"
                                >
                                    Logout
                                </button>
                                <button
                                    onClick={() => setIsConfirming(true)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition w-full"
                                >
                                    Delete Account
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition w-full"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-[var(--text-primary)] mb-4">
                                Please confirm that you want to permanently delete your account. All your data will be removed.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsConfirming(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default DeleteAccount;