
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
			<div className="auth-form container">
				<div className="card" style={{ maxWidth: 640, margin: '2rem auto' }}>
					<div className="card-body">
						<h2 style={{ marginBottom: 12 }}>Register</h2>
						<form onSubmit={handleSubmit} className="grid md-grid-cols-2 gap-4">
							<input className="form-input" type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
							<input className="form-input" type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
							<input className="form-input" type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
							<input className="form-input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
							<input className="form-input" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
							<div style={{ gridColumn: '1 / -1' }}>
								<button className="btn btn-primary" type="submit" disabled={loading}>Register</button>
							</div>
						</form>
						{error && <p className="form-error">{error}</p>}
					</div>
				</div>
				<ToastContainer />
			</div>
		);
};

export default Register;
