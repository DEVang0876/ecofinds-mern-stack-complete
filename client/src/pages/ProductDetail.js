

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import { getPrimaryImage } from '../utils/imageFallbacks';


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
		const result = await addToCart(product._id, quantity);
		if (result.success) {
			toast.success('Added to cart!');
		} else {
			toast.error(result.error);
		}
	};

	if (loading) return <div>Loading product...</div>;
	if (error) return <div>{error}</div>;
	if (!product) return <div>Product not found.</div>;

	const img = getPrimaryImage(product);
	return (
		<div className="container" style={{maxWidth:900, margin:'0 auto', padding:'32px 0'}}>
			<div className="card" style={{display:'flex', gap:32, alignItems:'flex-start', padding:'32px'}}>
				<div style={{width:320, minWidth:220, height:320, borderRadius:12, overflow:'hidden', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center'}}>
					<img src={img.url} alt={img.alt || product.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
				</div>
				<div style={{flex:1}}>
					<h2 style={{margin:'0 0 12px', fontSize:'2rem'}}>{product.title || product.name}</h2>
					<div style={{marginBottom:12, fontSize:15, color:'#555'}}>{product.description}</div>
					<div style={{marginBottom:16, fontWeight:600, fontSize:'1.2rem'}}>Price: ${product.price}</div>
					<div style={{marginBottom:12, display:'flex', gap:12}}>
						<span className="badge" style={{background:'#eef2ff', color:'#4338ca'}}>{product.category}</span>
						<span className="badge" style={{background:'#f1f5f9', color:'#334155'}}>{product.condition}</span>
						{product.tags && Array.isArray(product.tags) && product.tags.map(tag => (
							<span key={tag} className="badge" style={{background:'#e0f2fe', color:'#0369a1'}}>{tag}</span>
						))}
					</div>
					<div style={{marginBottom:18, fontSize:14}}>
						<span style={{color:'#888'}}>Seller:</span> {product.seller?.username || product.seller?.firstName || 'Unknown'}
					</div>
					<div style={{display:'flex', alignItems:'center', gap:12}}>
						<label>Quantity:</label>
						<input
							type="number"
							min="1"
							value={quantity}
							onChange={e => setQuantity(Number(e.target.value))}
							style={{width:70}}
						/>
						<button className="button" onClick={handleAddToCart}>Add to Cart</button>
					</div>
					{cartError && <p className="error" style={{color:'var(--color-danger)', marginTop:12}}>{cartError}</p>}
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default ProductDetail;
