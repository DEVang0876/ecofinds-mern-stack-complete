
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
		<div style={{minHeight:'calc(100vh - 140px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px'}}>
			<div className="card" style={{width:'100%', maxWidth:520, padding:'34px 42px', position:'relative'}}>
				<h2 style={{margin:'0 0 6px', fontSize:'1.55rem'}}>Create your account</h2>
				<p style={{margin:'0 0 24px', fontSize:14, color:'var(--color-text-light)'}}>Join EcoFinds to start listing and purchasing items.</p>
				<form onSubmit={handleSubmit} style={{display:'grid', gap:18, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
					<div style={{gridColumn:'1/-1'}}>
						<label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:6}}>Username</label>
						<input className="input" type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
					</div>
					<div>
						<label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:6}}>First Name</label>
						<input className="input" type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
					</div>
					<div>
						<label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:6}}>Last Name</label>
						<input className="input" type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
					</div>
					<div>
						<label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:6}}>Email</label>
						<input className="input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
					</div>
					<div>
						<label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:6}}>Password</label>
						<input className="input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
					</div>
					<div style={{gridColumn:'1/-1', display:'flex', justifyContent:'flex-end'}}>
						<button type="submit" className="button" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
					</div>
				</form>
				{error && <p className="error" style={{color:'var(--color-danger)', marginTop:16}}>{error}</p>}
				<div style={{marginTop:26, fontSize:13}}>
					Already have an account? <Link to="/login" style={{color:'var(--color-primary)', fontWeight:500}}>Login</Link>
				</div>
				<ToastContainer />
			</div>
		</div>
	);
};

export default Register;
