
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
		<div style={{minHeight:'calc(100vh - 140px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px'}}>
			<div className="card" style={{width:'100%', maxWidth:430, padding:'34px 38px', position:'relative'}}>
				<h2 style={{margin:'0 0 6px', fontSize:'1.55rem'}}>Welcome back</h2>
				<p style={{margin:'0 0 24px', fontSize:14, color:'var(--color-text-light)'}}>Sign in to continue buying & selling.</p>
				<form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:18}}>
					<div>
						<label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:6}}>Email</label>
						<input
							className="input"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div>
						<label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:6}}>Password</label>
						<input
							className="input"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="button" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
				</form>
				{error && <p className="error" style={{color:'var(--color-danger)', marginTop:16}}>{error}</p>}
				<div style={{marginTop:26, fontSize:13}}>
					New here? <Link to="/register" style={{color:'var(--color-primary)', fontWeight:500}}>Create an account</Link>
				</div>
				<ToastContainer />
			</div>
		</div>
	);
};

export default Login;
