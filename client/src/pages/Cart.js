
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
		<div className="cart-page">
			<h2>Shopping Cart</h2>
			{loading && <p>Loading...</p>}
			{error && <p className="error">{error}</p>}
			{items.length === 0 ? (
				<p>Your cart is empty.</p>
			) : (
				<div>
					<ul>
						{items.map(item => (
							<li key={item.product._id} className="cart-item">
								<span>{item.product.title || item.product.name}</span>
								<span>Price: ${item.price}</span>
								<span>Quantity: 
									<input
										type="number"
										min="1"
										value={item.quantity}
										onChange={e => handleUpdate(item.product._id, Number(e.target.value))}
									/>
								</span>
								<button onClick={() => handleRemove(item.product._id)}>Remove</button>
							</li>
						))}
					</ul>
					<p>Total Items: {totalItems}</p>
					<p>Total Amount: ${totalAmount}</p>
					<button onClick={handleClear}>Clear Cart</button>
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default Cart;
