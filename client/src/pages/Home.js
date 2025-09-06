import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
	<div className="container">
		<div className="card" style={{ margin: '2rem 0', padding: '2rem' }}>
			<div className="card-body">
				<h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome to EcoFinds</h1>
				<p style={{ color: '#475569', marginBottom: '1rem' }}>Discover sustainable second-hand products — curated items, great prices, and eco-friendly choices.</p>
				<Link to="/products" className="btn btn-primary">Browse Products</Link>
			</div>
		</div>
	</div>
);

export default Home;
