
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const MyListings = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchMyProducts();
	}, []);

	const fetchMyProducts = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get('/products/user/my-products');
			const raw = res.data;
			let extracted = [];
			// Backend paginatedResponse: data is an array
			if (Array.isArray(raw.data)) {
				extracted = raw.data;
			} else if (raw.data && Array.isArray(raw.data.products)) {
				extracted = raw.data.products;
			} else if (Array.isArray(raw.products)) {
				extracted = raw.products;
			}
			setProducts(extracted);
		} catch (err) {
			console.error('Fetch my products error', err?.response?.data || err.message);
			setError('Failed to load your listings');
		} finally {
			setLoading(false);
		}
	};

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
		<div className="my-listings-page">
			<h2>My Listings</h2>
			{loading && <p>Loading...</p>}
			{error && <p className="error">{error}</p>}
			{products.length === 0 ? (
				<p>You have no listings.</p>
			) : (
				<ul>
					{products.map(product => (
						<li key={product._id} className="listing-item">
							<span>{product.title || product.name}</span>
							<span>Price: ${product.price}</span>
							<Link to={`/edit-product/${product._id}`}>Edit</Link>
							<button onClick={() => handleDelete(product._id)}>Delete</button>
						</li>
					))}
				</ul>
			)}
			<button onClick={fetchMyProducts} disabled={loading} style={{marginTop:'1rem'}}>Refresh</button>
			<ToastContainer />
		</div>
	);
};

export default MyListings;
