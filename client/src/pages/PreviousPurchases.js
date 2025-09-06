
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
			try {
				const res = await api.get('/orders/my-orders');
				console.log('API response for /orders/my-orders:', res.data);
				// Normalize response shapes
				let orders = [];
				if (Array.isArray(res.data.data)) orders = res.data.data;
				else if (res.data.data && Array.isArray(res.data.data.orders)) orders = res.data.data.orders;
				else if (Array.isArray(res.data.orders)) orders = res.data.orders;
				else if (res.data.data && res.data.data.order) orders = [res.data.data.order];
				setOrders(orders);
			} catch (err) {
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
		<div style={{ padding: 20 }}>
			<h2>Previous Purchases</h2>
			{orders.length === 0 ? (
				<div style={{ color: '#666' }}>No previous purchases found.</div>
			) : (
				orders.map(order => (
					<div key={order._id} style={{ marginBottom: 20, border: '1px solid #e6e6e6', borderRadius: 8, overflow: 'hidden' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: '#fafafa', borderBottom: '1px solid #eee' }}>
							<div>
								<div style={{ fontSize: 16, fontWeight: 700 }}>Order #{order.orderNumber}</div>
								<div style={{ color: '#666', fontSize: 13 }}>{new Date(order.createdAt).toLocaleString()}</div>
							</div>
							<div style={{ textAlign: 'right' }}>
								<div style={{ fontWeight: 700 }}>${order.totalAmount}</div>
								<div style={{ color: '#0ea5a4', fontWeight: 600 }}>{order.status}</div>
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
				))
			)}
		</div>
	);
};

export default PreviousPurchases;
