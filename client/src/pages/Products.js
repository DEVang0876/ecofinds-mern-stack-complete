
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

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
			<div className="products-list container">
				<h2 style={{ margin: '1.25rem 0' }}>Products</h2>
				<div className="product-grid">
					{products.length === 0 ? (
						<p>No products found.</p>
					) : (
						products.map(product => (
							<ProductCard key={product._id} product={product} />
						))
					)}
				</div>
			</div>
		);
};

export default Products;
