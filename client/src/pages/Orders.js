
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
		<div className="orders-page">
			<h2>Orders</h2>
			{orders.length === 0 ? (
				<p>No orders found.</p>
			) : (
				<ul>
					{orders.map(order => (
						<li key={order._id} className="order-item">
							<span>Order #: {order.orderNumber}</span>
							<span>Status: {order.status}</span>
							<span>Total: ${order.totalAmount}</span>
							<span>Items: {order.totalItems}</span>
							<span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Orders;
