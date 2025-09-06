
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const OrderItem = ({ item }) => (
	<div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 8, borderBottom: '1px solid #eee' }}>
		<img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={item.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
		<div style={{ flex: 1 }}>
			<div style={{ fontWeight: 600 }}>{item.title}</div>
			<div style={{ color: '#666', fontSize: 13 }}>{item.quantity} × ${item.price}</div>
			<div style={{ color: '#444', fontSize: 13 }}>Seller: {item.seller?.username || item.seller?.firstName || 'Unknown'}</div>
		</div>
		<div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
	</div>
);

const PreviousPurchases = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			try {
				const res = await api.get('/orders/my-orders');
				setOrders(res.data.orders || []);
			} catch (err) {
				setError(err.response?.data?.message || err.message || 'Failed to load orders');
			}
			setLoading(false);
		};

		fetchOrders();
	}, []);

	if (loading) return <div className="container"><div className="card"><div className="card-body">Loading orders...</div></div></div>;

	if (error) return <div className="container"><div className="card"><div className="card-body">Error: {error}</div></div></div>;

	return (
		<div className="container">
			<h2 style={{ margin: '1rem 0' }}>Previous Purchases</h2>
			{orders.length === 0 ? (
				<div className="card"><div className="card-body">No previous purchases found.</div></div>
			) : (
				<div style={{ display: 'grid', gap: 16 }}>
					{orders.map(order => (
						<div key={order._id} className="card">
							<div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid #eee', background: '#fafafa' }}>
								<div>
									<div style={{ fontSize: 16, fontWeight: 700 }}>Order #{order.orderNumber}</div>
									<div style={{ color: '#666', fontSize: 13 }}>{new Date(order.createdAt).toLocaleString()}</div>
								</div>
								<div style={{ textAlign: 'right' }}>
									<div style={{ fontWeight: 700 }}>${order.totalAmount}</div>
									<div style={{ color: '#059669', fontWeight: 600 }}>{order.status}</div>
								</div>
							</div>

							<div>
								{order.items && order.items.length > 0 ? (
									order.items.map(item => <OrderItem key={item._id} item={item} />)
								) : (
									<div style={{ padding: 12 }}>No items found for this order.</div>
								)}
							</div>

							<div style={{ padding: 12, background: '#fafafa', borderTop: '1px solid #eee' }}>
								<div style={{ fontWeight: 700 }}>Shipping Address</div>
								{order.shippingAddress ? (
									<div style={{ color: '#444' }}>
										{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
									</div>
								) : (
									<div style={{ color: '#666' }}>No shipping address available</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PreviousPurchases;
