
import React from 'react';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';

const Cart = () => {
	const {
		items,
		totalAmount,
		totalItems,
		updateCartItem,
		removeFromCart,
		clearCart,
		loading,
		error,
		clearError
	} = useCart();

	const handleUpdate = async (productId, quantity) => {
		clearError();
		const result = await updateCartItem(productId, quantity);
		if (!result.success) toast.error(result.error);
	};

	const handleRemove = async (productId) => {
		clearError();
		const result = await removeFromCart(productId);
		if (!result.success) toast.error(result.error);
	};

	const handleClear = async () => {
		clearError();
		const result = await clearCart();
		if (!result.success) toast.error(result.error);
	};

	return (
			<div className="cart-page container">
				<h2 style={{ margin: '1rem 0' }}>Shopping Cart</h2>
				<div className="card">
					<div className="card-body">
						{loading && <p>Loading...</p>}
						{error && <p className="form-error">{error}</p>}

						{items.length === 0 ? (
							<div className="text-center p-4">Your cart is empty.</div>
						) : (
							<div>
								<ul style={{ listStyle: 'none', padding: 0 }}>
									{items.map(item => (
										<li key={item.product._id} className="cart-item flex items-center justify-between p-3 border-b" style={{ gap: 12 }}>
											<div className="flex items-center" style={{ gap: 12 }}>
												<img src={item.product.images?.[0]?.url || item.product.images?.[0] || '/placeholder-img.png'} alt={item.product.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
												<div>
													<div style={{ fontWeight: 700 }}>{item.product.title || item.product.name}</div>
													<div className="text-gray-600">Price: ${item.price}</div>
												</div>
											</div>

											<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
												<input type="number" min="1" value={item.quantity} onChange={e => handleUpdate(item.product._id, Number(e.target.value))} style={{ width: 80, padding: '0.4rem', borderRadius: 8, border: '1px solid #e5e7eb' }} />
												<button className="btn btn-outline" onClick={() => handleRemove(item.product._id)}>Remove</button>
											</div>
										</li>
									))}
								</ul>

								<div className="flex justify-between items-center p-3">
									<div>
										<div style={{ fontWeight: 700 }}>Total Items: {totalItems}</div>
										<div className="text-green-600" style={{ fontWeight: 700 }}>Total Amount: ${Number(totalAmount || 0).toFixed(2)}</div>
									</div>
									<div style={{ display: 'flex', gap: 8 }}>
										<button className="btn btn-outline" onClick={handleClear}>Clear Cart</button>
										<button className="btn btn-primary">Proceed to Checkout</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				<ToastContainer />
			</div>
	);
};

export default Cart;
