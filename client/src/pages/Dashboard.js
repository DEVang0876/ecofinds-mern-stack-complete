
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
	const { user, updateProfile, error, clearError, loading } = useAuth();
	const [form, setForm] = useState({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		email: user?.email || '',
		phone: user?.phone || ''
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		clearError();
		const result = await updateProfile(form);
		if (result.success) {
			toast.success('Profile updated!');
		} else {
			toast.error(result.error);
		}
	};

	return (
		<div className="dashboard-page">
			<h2>User Dashboard</h2>
			<form onSubmit={handleSubmit}>
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
					type="text"
					name="phone"
					placeholder="Phone"
					value={form.phone}
					onChange={handleChange}
				/>
				<button type="submit" disabled={loading}>Update Profile</button>
			</form>
			{error && <p className="error">{error}</p>}
			<ToastContainer />
		</div>
	);
};

export default Dashboard;
