
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import Button from '../components/common/Button';
import api from '../services/api';

const Dashboard = () => {
	const { user, updateProfile, error, clearError, loading } = useAuth();
	const [stats, setStats] = useState({ listings: 0, orders: 0, sales: 0 });
	const [metaLoading, setMetaLoading] = useState(false);
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

	useEffect(() => {
		const loadMeta = async () => {
			if (!user) return;
			try {
				setMetaLoading(true);
				// Fetch my products (first page just to get total from pagination)
				const [prodRes, orderRes, salesRes] = await Promise.all([
					api.get('/products/user/my-products?page=1&limit=1'),
					api.get('/orders/my-orders?page=1&limit=1'),
					api.get('/orders/sales?page=1&limit=1')
				]);
				setStats({
					listings: prodRes.data.pagination?.totalItems || 0,
					orders: orderRes.data.pagination?.totalItems || 0,
					sales: salesRes.data.pagination?.totalItems || 0
				});
			} catch (e) {
				// silent fail
			} finally {
				setMetaLoading(false);
			}
		};
		loadMeta();
	}, [user]);

	return (
		<div className="container" style={{paddingTop:'1rem', paddingBottom:'2.5rem', maxWidth:960}}>
			<h2 style={{margin:'0 0 24px'}}>Dashboard</h2>
			<div style={{display:'grid', gap:24, gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', marginBottom:28}}>
				<div className="card" style={{display:'flex', gap:16, alignItems:'center'}}>
					<div style={{width:70, height:70, borderRadius:'50%', overflow:'hidden', border:'2px solid var(--color-border)', background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', fontWeight:700, color:'#4338ca'}}>
						{user?.avatar ? (
							<img src={user.avatar} alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
						) : (
							(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()
						)}
					</div>
					<div style={{flex:1}}>
						<div style={{fontWeight:600, fontSize:'1rem'}}>{user?.firstName} {user?.lastName}</div>
						<div style={{fontSize:13, color:'var(--color-text-light)'}}>@{user?.username}</div>
						<div style={{marginTop:6, display:'flex', gap:8, flexWrap:'wrap'}}>
							<span className="badge" style={{background:'#eef2ff', color:'#4338ca'}}>{user?.role}</span>
							{user?.emailVerified ? <span className="badge" style={{background:'#dcfce7', color:'#166534'}}>Email Verified</span> : <span className="badge" style={{background:'#fef9c3', color:'#92400e'}}>Email Unverified</span>}
						</div>
					</div>
				</div>
				<div className="card" style={{padding:'18px 20px'}}>
					<div style={{fontSize:13, textTransform:'uppercase', letterSpacing:.5, fontWeight:600, marginBottom:10, opacity:.7}}>Account</div>
					<div style={{display:'grid', rowGap:10, fontSize:14}}>
						<div style={{display:'flex', justifyContent:'space-between'}}><span>Email</span><span style={{fontWeight:500}}>{user?.email}</span></div>
						<div style={{display:'flex', justifyContent:'space-between'}}><span>Phone</span><span style={{fontWeight:500}}>{user?.phone || '-'}</span></div>
						<div style={{display:'flex', justifyContent:'space-between'}}><span>Active</span><span style={{fontWeight:500}}>{user?.isActive ? 'Yes' : 'No'}</span></div>
						<div style={{display:'flex', justifyContent:'space-between'}}><span>Country</span><span style={{fontWeight:500}}>{user?.address?.country || '—'}</span></div>
					</div>
				</div>
				<div className="card" style={{padding:'18px 20px'}}>
					<div style={{fontSize:13, textTransform:'uppercase', letterSpacing:.5, fontWeight:600, marginBottom:10, opacity:.7}}>Activity</div>
					<div style={{display:'grid', rowGap:12, fontSize:14}}>
						<div style={{display:'flex', justifyContent:'space-between'}}><span>Listings</span><span style={{fontWeight:600}}>{metaLoading ? '—' : stats.listings}</span></div>
						<div style={{display:'flex', justifyContent:'space-between'}}><span>Orders Placed</span><span style={{fontWeight:600}}>{metaLoading ? '—' : stats.orders}</span></div>
						<div style={{display:'flex', justifyContent:'space-between'}}><span>Sales (as Seller)</span><span style={{fontWeight:600}}>{metaLoading ? '—' : stats.sales}</span></div>
					</div>
				</div>
			</div>
			<div className="card" style={{padding:'24px 28px'}}>
				<h3 style={{margin:'0 0 16px', fontSize:'1.05rem'}}>Edit Profile</h3>
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
