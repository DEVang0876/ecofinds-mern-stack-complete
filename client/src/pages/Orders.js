
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await api.get('/orders/my-orders');
				// Backend paginatedResponse returns: { status, message, data: [...], pagination }
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
				console.error('Fetch orders error', err?.response?.data || err.message);
				setError('Failed to load orders');
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	if (loading) return <div>Loading orders...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className="container" style={{paddingTop:'1rem', paddingBottom:'2rem'}}>
			<h2 style={{margin:'0 0 16px'}}>Orders</h2>
			{orders.length === 0 ? (
				<p>No orders found.</p>
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
							{Array.isArray(o.items) && o.items.length > 0 && (
								<div style={{marginTop:8}}>
									<div style={{fontSize:'12px', fontWeight:600, marginBottom:4}}>Items</div>
									<ul style={{margin:0, paddingLeft:18, fontSize:'13px'}}>
										{o.items.slice(0,5).map(it => (
											<li key={it.product}>
												{it.title} x {it.quantity} (${it.price})
											</li>
										))}
										{o.items.length > 5 && <li>… {o.items.length - 5} more</li>}
									</ul>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Orders;
