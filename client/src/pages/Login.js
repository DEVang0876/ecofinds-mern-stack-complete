
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
		<div className="auth-form">
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit" disabled={loading}>Login</button>
			</form>
			{error && <p className="error">{error}</p>}
			<ToastContainer />
		</div>
	);
};

export default Login;
