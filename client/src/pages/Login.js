
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
	const { login, error, clearError, loading } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		clearError();
		const result = await login(email, password);
		if (result.success) {
			toast.success('Login successful!');
			navigate('/');
		} else {
			toast.error(result.error);
		}
	};

		return (
			<div className="auth-form container">
				<div className="card" style={{ maxWidth: 520, margin: '2rem auto' }}>
					<div className="card-body">
						<h2 style={{ marginBottom: 12 }}>Login</h2>
						<form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 10 }}>
							<input className="form-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
							<input className="form-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
							<div style={{ display: 'flex', gap: 8 }}>
								<button className="btn btn-primary" type="submit" disabled={loading}>Login</button>
							</div>
						</form>
						{error && <p className="form-error">{error}</p>}
					</div>
				</div>
				<ToastContainer />
			</div>
		);
};

export default Login;
