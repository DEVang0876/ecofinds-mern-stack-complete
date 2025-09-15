import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
const logo = '/logonew.png';

const FEATURED_CATEGORIES = [
	'Electronics','Clothing','Furniture','Books'
];

const Home = () => {
	const [latest, setLatest] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLatest = async () => {
			try {
				const res = await api.get('/products?limit=8&sortBy=recent');
				const raw = res.data;
				let arr = [];
				if (Array.isArray(raw.data)) arr = raw.data; else if (raw.data && Array.isArray(raw.data.products)) arr = raw.data.products; else if (Array.isArray(raw.products)) arr = raw.products;
				setLatest(arr);
			} catch (e) {
				// ignore for home display
			} finally {
				setLoading(false);
			}
		};
		fetchLatest();
	}, []);

	return (
		<div className="container" style={{paddingTop:'1rem', paddingBottom:'3rem'}}>
			<div style={{display:'flex', justifyContent:'center', marginBottom:28}}>
				<img src={logo} alt="EcoFinds" style={{height:80, width:'auto'}} />
			</div>
			<section style={{display:'grid', gap:24, gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', alignItems:'center', marginBottom:48}}>
				<div>
					<h1 style={{fontSize:'2rem', lineHeight:1.2, margin:'0 0 12px'}}>Buy & Sell Pre‑Loved Goods Sustainably</h1>
					<p style={{fontSize:'15px', color:'var(--color-text-light)', margin:'0 0 20px'}}>Join the circular economy. Find quality items a second home and earn by listing what you no longer need.</p>
					<div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
						<a href="/products" className="button">Browse Products</a>
						<a href="/add-product" className="button outline">List an Item</a>
					</div>
				</div>
				<div className="card" style={{minHeight:220, display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', background:'linear-gradient(135deg,#059669,#10b981)', color:'#fff', fontWeight:600}}>
					Reduce waste • Save money • Support reuse
				</div>
			</section>

			<section style={{marginBottom:40}}>
				<h2 style={{margin:'0 0 16px', fontSize:'1.25rem'}}>Featured Categories</h2>
				<div style={{display:'flex', gap:16, flexWrap:'wrap'}}>
					{FEATURED_CATEGORIES.map(cat => (
						<a key={cat} href={`/products?category=${encodeURIComponent(cat)}`} className="badge" style={{fontSize:'14px', padding:'8px 14px'}}>{cat}</a>
					))}
				</div>
			</section>

			<section>
				<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
					<h2 style={{margin:0, fontSize:'1.25rem'}}>Latest Listings</h2>
					<a href="/products" style={{fontSize:13, textDecoration:'none', color:'var(--color-primary)'}}>View all →</a>
				</div>
				{loading ? <p>Loading...</p> : (
					latest.length === 0 ? <p>No products yet.</p> : (
						<div className="grid cols-4">
							{latest.map(p => <ProductCard key={p._id} product={p} />)}
						</div>
					)
				)}
			</section>
		</div>
	);
};

export default Home;
