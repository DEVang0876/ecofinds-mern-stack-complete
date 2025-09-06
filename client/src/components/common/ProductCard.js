import React from 'react';
import { Link } from 'react-router-dom';
import { getPrimaryImage } from '../../utils/imageFallbacks';

const ProductCard = ({ product, actions }) => {
	if (!product) return null;
	const img = getPrimaryImage(product);
	return (
		<div className="card product-card-ui">
			<div className="product-image-wrapper">
				<img src={img.url} alt={img.alt || product.title} />
			</div>
			<div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
				<Link to={`/products/${product._id}`} style={{textDecoration:'none', color:'inherit'}}>
					<h3 style={{fontSize:'15px', lineHeight:'1.3', margin:0}}>{product.title}</h3>
				</Link>
				<div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
					<span style={{fontWeight:600}}>${product.price}</span>
					<span className="badge" style={{textTransform:'capitalize'}}>{product.condition}</span>
				</div>
				<div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
					<span className="badge" style={{background:'#eef2ff', color:'#4338ca'}}>{product.category}</span>
					{product.quantity !== undefined && <span className="badge" style={{background:'#f1f5f9', color:'#334155'}}>Qty: {product.quantity}</span>}
				</div>
				{actions && <div className="flex gap-2" style={{marginTop:4}}>{actions}</div>}
			</div>
		</div>
	);
};

export default ProductCard;
