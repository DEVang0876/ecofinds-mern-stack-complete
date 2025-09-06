
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
			<ToastContainer />
		</div>
	);
};

export default MyListings;
