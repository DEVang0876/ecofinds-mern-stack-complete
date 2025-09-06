import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPrimaryImage } from '../../utils/imageFallbacks';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product, actions }) => {
	const navigate = useNavigate();
	const { addToCart, loading: cartLoading } = useCart();
	const { isAuthenticated, user } = useAuth();
	const [adding, setAdding] = useState(false);
	if (!product) return null;
	const img = getPrimaryImage(product);
	const isOwner = user && product.seller && (product.seller._id === user._id || product.seller === user._id);
	const disabled = adding || cartLoading || isOwner || !product.isAvailable || product.quantity === 0;

	const handleAdd = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isAuthenticated) {
			toast.info('Please login to add to cart');
			navigate('/login');
			return;
		}
		if (disabled) return;
		setAdding(true);
		const res = await addToCart(product._id, 1);
		setAdding(false);
		if (res.success) {
			toast.success('Added to cart');
		} else {
			toast.error(res.error || 'Failed to add');
		}
	};

	return (
		<div className="card product-card-ui">
			<div className="product-image-wrapper">
				<img src={img.url} alt={img.alt || product.title} />
			</div>
			<div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
				<Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
					<h3 style={{ fontSize: '15px', lineHeight: '1.3', margin: 0 }}>{product.title}</h3>
				</Link>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<span style={{ fontWeight: 600 }}>${product.price}</span>
					<span className="badge" style={{ textTransform: 'capitalize' }}>{product.condition}</span>
				</div>
				<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
					<span className="badge" style={{ background: '#eef2ff', color: '#4338ca' }}>{product.category}</span>
					{product.quantity !== undefined && <span className="badge" style={{ background: '#f1f5f9', color: '#334155' }}>Qty: {product.quantity}</span>}
				</div>
				<div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
					<button
						onClick={handleAdd}
						disabled={disabled}
						className="button"
						style={{ flex: 1, opacity: disabled ? 0.6 : 1 }}
					>
						{isOwner ? 'Your Item' : !product.isAvailable || product.quantity === 0 ? 'Unavailable' : adding ? 'Adding...' : 'Add to Cart'}
					</button>
					{actions && <div className="flex gap-2" style={{marginTop:0}}>{actions}</div>}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
