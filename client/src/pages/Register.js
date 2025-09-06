
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
	const { register, error, clearError, loading } = useAuth();
	const [form, setForm] = useState({
		email: '',
		password: '',
		username: '',
		firstName: '',
		lastName: ''
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		clearError();
		const result = await register(form);
		if (result.success) {
			toast.success('Registration successful!');
			navigate('/');
		} else {
			toast.error(result.error);
		}
	};

	return (
		<div className="auth-form">
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={form.username}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="firstName"
					placeholder="First Name"
					value={form.firstName}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="lastName"
					placeholder="Last Name"
					value={form.lastName}
					onChange={handleChange}
					required
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={form.password}
					onChange={handleChange}
					required
				/>
				<button type="submit" disabled={loading}>Register</button>
			</form>
			{error && <p className="error">{error}</p>}
			<ToastContainer />
		</div>
	);
};

export default Register;
