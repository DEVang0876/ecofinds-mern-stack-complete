
import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
	const { isAuthenticated, user, logout } = useAuth();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	const handleLogout = async () => {
		await logout();
		navigate('/login');
		setOpen(false);
	};

	const linkClass = ({ isActive }) => isActive ? 'active' : '';

	return (
		<header className="navbar-modern">
			<div className="navbar-inner container" style={{justifyContent:'space-between'}}>
				<Link to="/" style={{textDecoration:'none', color:'var(--color-text)', fontWeight:700, fontSize:'1.15rem'}}>EcoFinds</Link>
				<button aria-label="Menu" onClick={() => setOpen(o=>!o)} className="button outline" style={{display:'none'}} id="nav-hamburger">☰</button>
				<nav className="nav-links desktop" style={{flex:1}}>
					<NavLink to="/" className={linkClass}>Home</NavLink>
					<NavLink to="/products" className={linkClass}>Products</NavLink>
					<NavLink to="/cart" className={linkClass}>Cart</NavLink>
					<NavLink to="/orders" className={linkClass}>Orders</NavLink>
					<NavLink to="/purchases" className={linkClass}>Previous Purchases</NavLink>
					{isAuthenticated && <NavLink to="/my-listings" className={linkClass}>My Listings</NavLink>}
					{isAuthenticated && <NavLink to="/add-product" className={linkClass}>Add Product</NavLink>}
				</nav>
				<div className="nav-links desktop" style={{justifyContent:'flex-end'}}>
					{isAuthenticated ? (
						<>
							<NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
							<button onClick={handleLogout} className="button light" style={{padding:'6px 12px'}}>Logout</button>
							<span style={{fontSize:12, color:'var(--color-text-light)'}}>Hi {user?.username || user?.email}</span>
						</>
					) : (
						<>
							<NavLink to="/login" className={linkClass}>Login</NavLink>
							<NavLink to="/register" className={linkClass}>Register</NavLink>
						</>
					)}
				</div>
			</div>
			{/* Drawer */}
			<div className="mobile-drawer-trigger" style={{position:'absolute', top:10, right:10, display:'none'}}>
				<button className="button outline" onClick={()=>setOpen(true)}>☰</button>
			</div>
			<div className={`mobile-drawer ${open ? 'open' : ''}`}>
				<div className="drawer-header">
					<span style={{fontWeight:700}}>Menu</span>
					<button className="button light" style={{padding:'4px 10px'}} onClick={()=>setOpen(false)}>✕</button>
				</div>
				<div className="drawer-links">
					<NavLink onClick={()=>setOpen(false)} to="/" className={linkClass}>Home</NavLink>
					<NavLink onClick={()=>setOpen(false)} to="/products" className={linkClass}>Products</NavLink>
					<NavLink onClick={()=>setOpen(false)} to="/cart" className={linkClass}>Cart</NavLink>
					<NavLink onClick={()=>setOpen(false)} to="/orders" className={linkClass}>Orders</NavLink>
					<NavLink onClick={()=>setOpen(false)} to="/purchases" className={linkClass}>Previous Purchases</NavLink>
					{isAuthenticated && <NavLink onClick={()=>setOpen(false)} to="/my-listings" className={linkClass}>My Listings</NavLink>}
					{isAuthenticated && <NavLink onClick={()=>setOpen(false)} to="/add-product" className={linkClass}>Add Product</NavLink>}
					{isAuthenticated ? (
						<>
							<NavLink onClick={()=>setOpen(false)} to="/dashboard" className={linkClass}>Dashboard</NavLink>
							<button onClick={handleLogout} className="button danger" style={{width:'100%', marginTop:8}}>Logout</button>
						</>
					) : (
						<>
							<NavLink onClick={()=>setOpen(false)} to="/login" className={linkClass}>Login</NavLink>
							<NavLink onClick={()=>setOpen(false)} to="/register" className={linkClass}>Register</NavLink>
						</>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;
