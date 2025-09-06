

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';


const ProductDetail = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const { addToCart, error: cartError, clearError } = useCart();

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await api.get(`/products/${id}`);
				setProduct(res.data.data || res.data.product);
			} catch (err) {
				setError('Failed to load product details');
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [id]);

	const handleAddToCart = async () => {
		clearError();
		console.log('Adding to cart payload:', { productId: product._id, quantity });
		const result = await addToCart(product._id, quantity);
		console.log('Add to cart result:', result);
		if (result.success) {
			toast.success('Added to cart!');
		} else {
			// result.error can be a string or an object (server response)
			const err = result.error;
			if (typeof err === 'string') {
				toast.error(err);
			} else if (err && err.message === 'Validation failed' && Array.isArray(err.errors)) {
				// show first validation message
				toast.error(err.errors[0]?.message || 'Validation failed');
			} else if (err && err.errors && err.errors.reason) {
				// structured error from server (cartController)
				const reason = err.errors.reason;
				if (reason === 'own_product') {
					toast.error('You cannot add your own product to cart');
				} else if (reason === 'insufficient_stock') {
					toast.error(err.errors.available ? `Only ${err.errors.available} available` : (err.message || 'Insufficient stock'));
				} else if (reason === 'product_unavailable') {
					toast.error('Product is no longer available');
				} else {
					toast.error(err.message || 'Failed to add to cart');
				}
			} else {
				toast.error(err?.message || 'Failed to add to cart');
			}
		}
	};

	if (loading) return <div>Loading product...</div>;
	if (error) return <div>{error}</div>;
	if (!product) return <div>Product not found.</div>;

		// Helper to convert plain text URLs into anchor elements
		const linkify = (text) => {
			if (!text) return null;
			// simple url regex
			const urlRegex = /(https?:\/\/[\w\-._~:?#[\]@!$&'()*+,;=\/]+)|(www\.[\w\-._~:?#[\]@!$&'()*+,;=\/]+)/g;
			const parts = text.split(urlRegex).filter(Boolean);
			return parts.map((part, i) => {
				if (part.match(urlRegex)) {
					let href = part.startsWith('http') ? part : `https://${part}`;
					return (<a key={i} href={href} target="_blank" rel="noopener noreferrer">{part}</a>);
				}
				return <span key={i}>{part}</span>;
			});
		};

			const DEFAULT_IMAGES = [
				'https://images.unsplash.com/photo-1609948897679-3b4b8f0c3f3d?w=1200&q=80&auto=format&fit=crop',
				'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop',
				'https://images.unsplash.com/photo-1513708928673-2a0d0b3c7f4f?w=1200&q=80&auto=format&fit=crop'
			];
			const images = (product.images && product.images.length) ? product.images.map(img => img.url || img) : [DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)]];

		return (
			<div className="product-detail container">
				<div className="grid md-grid-cols-2 gap-4">
					<div>
						{images.length > 0 ? (
							<div className="card">
								<img src={images[0]} alt={product.images?.[0]?.alt || product.title} className="product-image" />
							</div>
						) : (
							<div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
								<p>No image available</p>
							</div>
						)}
						{images.length > 1 && (
							<div className="flex gap-2 mt-4">
								{images.slice(1,5).map((src, idx) => (
									<img key={idx} src={src} alt={`${product.title} ${idx+2}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
								))}
							</div>
						)}
					</div>

					<div>
						<h2>{product.title || product.name}</h2>
						<p className="product-price">${Number(product.price || 0).toFixed(2)}</p>
						<div className="product-desc">{linkify(product.description)}</div>

						<div style={{ marginTop: '1rem' }}>
							<label style={{ marginRight: 8 }}>Quantity: </label>
							<input
								type="number"
								min="1"
								value={quantity}
								onChange={e => setQuantity(Number(e.target.value))}
								style={{ width: 80, padding: '0.4rem', borderRadius: 8, border: '1px solid #e5e7eb' }}
							/>
							<button className="btn btn-primary" style={{ marginLeft: 12 }} onClick={handleAddToCart}>Add to Cart</button>
						</div>

						{cartError && <p className="form-error">{cartError}</p>}
					</div>
				</div>
				<ToastContainer />
			</div>
		);
};

export default ProductDetail;
