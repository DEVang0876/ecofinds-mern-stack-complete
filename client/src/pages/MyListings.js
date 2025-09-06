
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';

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
		<div className="container" style={{paddingTop:'1rem', paddingBottom:'2rem'}}>
			<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
				<h2 style={{margin:0}}>My Listings</h2>
				<Button outline onClick={fetchMyProducts} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</Button>
			</div>
			{loading && <p>Loading...</p>}
			{error && <p className="error" style={{color:'var(--color-danger)'}}>{error}</p>}
			{!loading && products.length === 0 && <p>You have no listings.</p>}
			<div className="grid cols-4">
				{products.map(p => (
					<ProductCard
						key={p._id}
						product={p}
						actions={[
							<Link key="edit" to={`/edit-product/${p._id}`} className="button light" style={{textDecoration:'none'}}>Edit</Link>,
							<button key="del" className="button danger" onClick={() => handleDelete(p._id)}>Delete</button>
						]}
					/>
				))}
			</div>
			<ToastContainer />
		</div>
	);
};

export default MyListings;
