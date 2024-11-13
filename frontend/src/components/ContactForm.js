import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './contact.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const getCsrfToken = () => {
        const csrfToken = document.cookie
            .split(';')
            .find(cookie => cookie.trim().startsWith('csrftoken='))
            ?.split('=')[1];
        return csrfToken;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setStatus('Please fill in all fields.');
            return;
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            setStatus('CSRF token is missing.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                setStatus('Thank you for your feedback!');
                navigate('/thank-you'); // Navigate to the thank-you page if successful
            } else {
                const result = await response.json();
                setStatus(result.message || 'There was an error submitting your feedback.');
            }
        } catch (error) {
            setStatus('Network error. Please try again later.');
            console.error("Error submitting feedback:", error);
        }
    };

    return (
        <div className="contact-page">
            <section className="developer-info">
                <h2>Meet the Development Team</h2>
                <p>We are a passionate team of developers who created this platform to bring you an enjoyable and interactive experience. Feel free to reach out if you have any questions or feedback!</p>
            </section>

            <div className="contact-form">
                <h3>Contact the Developers</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Your Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Your Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Your Message:
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <button type="submit">Submit Feedback</button>
                </form>

                {status && <p className="status-message">{status}</p>}
            </div>
        </div>
    );
};

export default ContactForm;