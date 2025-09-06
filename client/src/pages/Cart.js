
import React from 'react';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import Button from '../components/common/Button';

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
		<div className="container" style={{paddingTop:'1rem', paddingBottom:'2rem'}}>
			<h2 style={{margin:'0 0 16px'}}>Shopping Cart</h2>
			{loading && <p>Loading...</p>}
			{error && <p className="error" style={{color:'var(--color-danger)'}}>{error}</p>}
			{items.length === 0 ? (
				<p>Your cart is empty.</p>
			) : (
				<div style={{display:'grid', gap:24, gridTemplateColumns:'minmax(0,1fr) 320px'}}>
					<div style={{display:'flex', flexDirection:'column', gap:16}}>
						{items.map(item => (
							<div key={item.product._id} className="card" style={{display:'flex', gap:16, alignItems:'center'}}>
								<div style={{flex:1}}>
									<div style={{fontWeight:600}}>{item.product.title || item.product.name}</div>
									<div style={{fontSize:13, color:'var(--color-text-light)'}}>Unit: ${item.price}</div>
								</div>
								<div style={{display:'flex', alignItems:'center', gap:8}}>
									<input
										style={{width:70}}
										type="number"
										min="1"
										value={item.quantity}
										onChange={e => handleUpdate(item.product._id, Number(e.target.value))}
									/>
									<div style={{fontWeight:600}}>${(item.price * item.quantity).toFixed(2)}</div>
									<button className="button danger" style={{padding:'6px 10px'}} onClick={() => handleRemove(item.product._id)}>Remove</button>
								</div>
							</div>
						))}
					</div>
					<div className="card" style={{height:'fit-content'}}>
						<h3 style={{marginTop:0, fontSize:'1rem'}}>Summary</h3>
						<div style={{display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:8}}>
							<span>Items</span><span>{totalItems}</span>
						</div>
						<div style={{display:'flex', justifyContent:'space-between', fontWeight:600, marginBottom:16}}>
							<span>Total</span><span>${totalAmount}</span>
						</div>
						<Button outline style={{width:'100%', marginBottom:8}} onClick={handleClear}>Clear Cart</Button>
						<Button style={{width:'100%'}} disabled>Checkout (Stub)</Button>
					</div>
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default Cart;
