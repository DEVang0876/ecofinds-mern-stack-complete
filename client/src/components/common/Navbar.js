
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
	const { isAuthenticated, user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

		return (
			<nav className="navbar" style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: '#fff', borderBottom: '1px solid #eee' }}>
				<h2 style={{ marginRight: '2rem' }}>EcoFinds</h2>
				<div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
					<Link to="/">Home</Link>
					<Link to="/products">Products</Link>
					<Link to="/cart">Cart</Link>
					<Link to="/orders">Orders</Link>
					<Link to="/previous-purchases">Previous Purchases</Link>
					<Link to="/my-listings">My Listings</Link>
					<Link to="/add-product">Add Product</Link>
					{isAuthenticated ? (
						<>
							<Link to="/dashboard">Dashboard</Link>
							<button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer' }}>Logout</button>
							<span style={{ color: '#333', fontWeight: 'bold' }}>Welcome, {user?.username || user?.email}</span>
						</>
					) : (
						<>
							<Link to="/login">Login</Link>
							<Link to="/register">Register</Link>
						</>
					)}
				</div>
			</nav>
		);
};

export default Navbar;
