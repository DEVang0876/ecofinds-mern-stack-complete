
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
				setOrders(res.data.data.orders || res.data.orders || []);
			} catch (err) {
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
		<div className="orders-page container">
			<h2 style={{ margin: '1rem 0' }}>Orders</h2>
			{orders.length === 0 ? (
				<div className="card"><div className="card-body">No orders found.</div></div>
			) : (
				<div style={{ display: 'grid', gap: 12 }}>
					{orders.map(order => (
						<div key={order._id} className="card">
							<div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid #eee', background: '#fafafa' }}>
								<div>
									<div style={{ fontWeight: 700 }}>Order #{order.orderNumber}</div>
									<div style={{ color: '#666' }}>{new Date(order.createdAt).toLocaleString()}</div>
								</div>
								<div style={{ textAlign: 'right' }}>
									<div style={{ fontWeight: 800 }}>${order.totalAmount}</div>
									<div style={{ color: '#059669', fontWeight: 600 }}>{order.status}</div>
								</div>
							</div>
							<div>
								{order.items && order.items.length > 0 ? order.items.map(item => (
									<div key={item._id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderBottom: '1px solid #f3f4f6' }}>
										<img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={item.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
										<div style={{ flex: 1 }}>
											<div style={{ fontWeight: 600 }}>{item.title}</div>
											<div className="text-gray-600">{item.quantity} × ${item.price}</div>
										</div>
										<div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
									</div>
								)) : (
									<div style={{ padding: 12 }}>No items</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Orders;
