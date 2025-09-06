
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import Button from '../components/common/Button';

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
		<div className="container" style={{paddingTop:'1rem', paddingBottom:'2rem', maxWidth:760}}>
			<h2 style={{margin:'0 0 20px'}}>User Dashboard</h2>
			<div className="card" style={{padding:'24px 28px'}}>
				<h3 style={{margin:'0 0 16px', fontSize:'1.05rem'}}>Profile</h3>
				<form onSubmit={handleSubmit} style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
					<div className="form-group" style={{margin:0}}>
						<label className="form-label">First Name</label>
						<input className="input" type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
					</div>
					<div className="form-group" style={{margin:0}}>
						<label className="form-label">Last Name</label>
						<input className="input" type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
					</div>
					<div className="form-group" style={{margin:0}}>
						<label className="form-label">Email</label>
						<input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
					</div>
					<div className="form-group" style={{margin:0}}>
						<label className="form-label">Phone</label>
						<input className="input" type="text" name="phone" value={form.phone} onChange={handleChange} />
					</div>
					<div style={{gridColumn:'1/-1', display:'flex', justifyContent:'flex-end'}}>
						<Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Profile'}</Button>
					</div>
				</form>
				{error && <p className="error" style={{color:'var(--color-danger)', marginTop:12}}>{error}</p>}
			</div>
			<ToastContainer />
		</div>
	);
};

export default Dashboard;
