
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
			<div className="dashboard-page container">
				<div className="card" style={{ maxWidth: 800, margin: '2rem auto' }}>
					<div className="card-body">
						<h2 style={{ marginBottom: 12 }}>User Dashboard</h2>
						<form onSubmit={handleSubmit} className="grid md-grid-cols-2 gap-4">
							<input className="form-input" type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
							<input className="form-input" type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
							<input className="form-input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
							<input className="form-input" type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
							<div style={{ gridColumn: '1 / -1' }}>
								<button className="btn btn-primary" type="submit" disabled={loading}>Update Profile</button>
							</div>
						</form>
						{error && <p className="form-error">{error}</p>}
					</div>
				</div>
				<ToastContainer />
			</div>
	);
};

export default Dashboard;
