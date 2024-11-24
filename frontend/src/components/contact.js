import React, { useState } from 'react';
import Layout from './Layout';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({
        type: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('http://localhost:8000/api/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Message sent successfully! We will get back to you soon.'
                });
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                });
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '40px 20px'
            }}>
                <h1 style={{
                    color: '#1DB954',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    Contact Developers
                </h1>

                <form onSubmit={handleSubmit} style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '30px',
                    borderRadius: '10px',
                    border: '1px solid rgba(29, 185, 84, 0.3)'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label 
                            htmlFor="name" 
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: 'white'
                            }}
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '5px',
                                color: 'white',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label 
                            htmlFor="email" 
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: 'white'
                            }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '5px',
                                color: 'white',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label 
                            htmlFor="message" 
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: 'white'
                            }}
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="6"
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '5px',
                                color: 'white',
                                fontSize: '16px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {status.message && (
                        <div style={{
                            padding: '10px',
                            marginBottom: '20px',
                            borderRadius: '5px',
                            backgroundColor: status.type === 'success' ? 'rgba(29, 185, 84, 0.2)' : 'rgba(255, 68, 68, 0.2)',
                            color: status.type === 'success' ? '#1DB954' : '#ff4444',
                            textAlign: 'center'
                        }}>
                            {status.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#1DB954',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </Layout>
    );
}