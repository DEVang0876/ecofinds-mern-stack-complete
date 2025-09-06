
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const PreviousPurchases = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await api.get('/orders/my-orders');
				const raw = res.data;
				let extracted = [];
				if (Array.isArray(raw.data)) {
					extracted = raw.data;
				} else if (raw.data && Array.isArray(raw.data.orders)) {
					extracted = raw.data.orders;
				} else if (Array.isArray(raw.orders)) {
					extracted = raw.orders;
				}
				setOrders(extracted);
			} catch (err) {
				console.error('Fetch previous purchases error', err?.response?.data || err.message);
				setError('Failed to load previous purchases');
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	if (loading) return <div>Loading previous purchases...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className="container" style={{paddingTop:'1rem', paddingBottom:'2rem'}}>
			<h2 style={{margin:'0 0 16px'}}>Previous Purchases</h2>
			{orders.length === 0 ? (
				<p>No previous purchases found.</p>
			) : (
				<div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
					{orders.map(o => (
						<div key={o._id} className="order-card">
							<div className="order-card-header">
								<strong>#{o.orderNumber}</strong>
								<span className={`status-badge ${o.status}`}>{o.status}</span>
							</div>
							<div className="order-meta">{new Date(o.createdAt).toLocaleString()}</div>
							<div style={{display:'flex', gap:16, flexWrap:'wrap', fontSize:'13px'}}>
								<span><strong>Items:</strong> {o.totalItems}</span>
								<span><strong>Total:</strong> ${o.totalAmount}</span>
								{o.paymentMethod && <span><strong>Payment:</strong> {o.paymentMethod}</span>}
								{o.shippingAddress && <span><strong>Ship To:</strong> {o.shippingAddress.city || ''} {o.shippingAddress.state || ''}</span>}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PreviousPurchases;
