
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
	const { isAuthenticated, user, logout } = useAuth();
	const { totalItems } = useCart();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

		return (
			<nav className="navbar">
				<div className="navbar-container container">
					<Link to="/" className="navbar-brand">EcoFinds</Link>
					<div className="navbar-nav">
						<Link className="navbar-link" to="/">Home</Link>
						<Link className="navbar-link" to="/products">Products</Link>
						<Link className="navbar-link" to="/cart">Cart{totalItems ? ` (${totalItems})` : ''}</Link>
						<Link className="navbar-link" to="/orders">Orders</Link>
						<Link className="navbar-link" to="/purchases">Previous Purchases</Link>
						<Link className="navbar-link" to="/my-listings">My Listings</Link>
						<Link className="navbar-link" to="/add-product">Add Product</Link>

						{isAuthenticated ? (
							<>
								<Link className="navbar-link" to="/dashboard">Dashboard</Link>
								<button className="btn btn-outline" onClick={handleLogout}>Logout</button>
								<span style={{ color: '#0f172a', fontWeight: 600 }}>Welcome, {user?.username || user?.email}</span>
							</>
						) : (
							<>
								<Link className="navbar-link" to="/login">Login</Link>
								<Link className="navbar-link" to="/register">Register</Link>
							</>
						)}
					</div>
				</div>
			</nav>
		);
};

export default Navbar;
