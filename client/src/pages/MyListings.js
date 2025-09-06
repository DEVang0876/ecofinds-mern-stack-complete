
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const MyListings = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMyProducts = async () => {
			try {
				const res = await api.get('/products/user/my-products');
				setProducts(res.data.data.products || res.data.products || []);
			} catch (err) {
				setError('Failed to load your listings');
			} finally {
				setLoading(false);
			}
		};
		fetchMyProducts();
	}, []);

	const handleDelete = async (id) => {
		try {
			await api.delete(`/products/${id}`);
			setProducts(products.filter(p => p._id !== id));
			toast.success('Product deleted!');
		} catch (err) {
			toast.error('Failed to delete product');
		}
	};

	return (
		<div className="my-listings-page container">
			<h2 style={{ margin: '1rem 0' }}>My Listings</h2>
			{loading && <p>Loading...</p>}
			{error && <p className="form-error">{error}</p>}
			{products.length === 0 ? (
				<div className="card"><div className="card-body">You have no listings.</div></div>
			) : (
				<div className="product-grid">
					{products.map(product => (
						<div key={product._id} className="product-card card">
							<img src={(product.images && (product.images[0].url || product.images[0])) || 'https://via.placeholder.com/300'} alt={product.title} className="product-image" />
							<div className="card-body">
								<div style={{ fontWeight: 700 }}>{product.title || product.name}</div>
								<div className="text-gray-600">${product.price}</div>
								<div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
									<Link to={`/edit-product/${product._id}`} className="btn btn-outline">Edit</Link>
									<button className="btn btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default MyListings;
