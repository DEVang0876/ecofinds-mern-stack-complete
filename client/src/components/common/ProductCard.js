import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const title = product.title || product.name || 'Untitled';
  const price = Number(product.price || 0).toFixed(2);
  const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1609948897679-3b4b8f0c3f3d?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513708928673-2a0d0b3c7f4f?w=1200&q=80&auto=format&fit=crop'
  ];
  const image = (product.images && product.images[0] && (product.images[0].url || product.images[0])) || DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];

  return (
    <article className="product-card card transition">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img src={image} alt={product.images?.[0]?.alt || title} className="product-image" />
      </Link>
      <div className="product-info card-body">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">${price}</p>
        <p className="product-desc">{product.description?.slice(0, 120)}{product.description?.length > 120 ? '…' : ''}</p>
        <div style={{ marginTop: '0.75rem' }}>
          <Link to={`/products/${product._id}`} className="btn btn-outline">View details</Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
