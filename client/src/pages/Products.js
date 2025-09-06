
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Products = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await api.get('/products');
				setProducts(res.data.data || res.data.products || []);
			} catch (err) {
				setError('Failed to load products');
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	if (loading) return <div>Loading products...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className="products-list">
			<h2>Products</h2>
			<div className="products-grid">
				{products.length === 0 ? (
					<p>No products found.</p>
				) : (
					products.map(product => (
						<div key={product._id} className="product-card">
							<h3>{product.title || product.name}</h3>
							<p>{product.description}</p>
							<p>Price: ${product.price}</p>
							<Link to={`/products/${product._id}`}>View Details</Link>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Products;
