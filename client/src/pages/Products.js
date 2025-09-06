
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
		<div className="container" style={{paddingTop:'1rem', paddingBottom:'2rem'}}>
			<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
				<h2 style={{margin:0, fontSize:'1.4rem'}}>Products</h2>
			</div>
			{products.length === 0 ? (
				<p>No products found.</p>
			) : (
				<div className="grid cols-4">
					{products.map(p => <ProductCard key={p._id} product={p} />)}
				</div>
			)}
		</div>
	);
};

export default Products;
