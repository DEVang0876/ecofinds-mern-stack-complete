

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
			toast.error(result.error || 'Failed to add to cart');
		}
	};

	if (loading) return <div>Loading product...</div>;
	if (error) return <div>{error}</div>;
	if (!product) return <div>Product not found.</div>;

	return (
		<div className="product-detail">
			<h2>{product.title || product.name}</h2>
			<p>{product.description}</p>
			<p>Price: ${product.price}</p>
			<div>
				<label>Quantity: </label>
				<input
					type="number"
					min="1"
					value={quantity}
					onChange={e => setQuantity(Number(e.target.value))}
				/>
				<button onClick={handleAddToCart}>Add to Cart</button>
			</div>
			{cartError && <p className="error">{cartError}</p>}
			<ToastContainer />
		</div>
	);
};

export default ProductDetail;
