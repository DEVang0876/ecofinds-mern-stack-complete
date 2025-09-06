
import React, { useState } from 'react';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

const AddProduct = () => {
		const [form, setForm] = useState({
			title: '',
			description: '',
			price: '',
			category: 'Electronics',
			condition: 'New'
		});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			// Ensure numeric price and properly formatted payload
			const payload = {
				title: form.title,
				description: form.description,
				price: Number(form.price),
				category: form.category,
				condition: form.condition
			};
			const res = await api.post('/products', payload);
			toast.success(res.data?.message || 'Product added!');
			setForm({ title: '', description: '', price: '', category: 'Electronics', condition: 'New' });
		} catch (err) {
			const msg = err.response?.data?.message || 'Failed to add product';
			setError(msg);
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add-product-page container">
			<div className="card" style={{ maxWidth: 900, margin: '2rem auto' }}>
				<div className="card-body">
					<h2 style={{ marginBottom: 12 }}>Add Product</h2>
					<form onSubmit={handleSubmit} className="grid md-grid-cols-2 gap-4">
						<input className="form-input" type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
						<select className="form-input" name="category" value={form.category} onChange={handleChange} required>
							<option value="Electronics">Electronics</option>
							<option value="Clothing">Clothing</option>
							<option value="Books">Books</option>
							<option value="Furniture">Furniture</option>
							<option value="Sports">Sports</option>
							<option value="Toys">Toys</option>
							<option value="Vehicles">Vehicles</option>
							<option value="Home & Garden">Home & Garden</option>
							<option value="Health & Beauty">Health & Beauty</option>
							<option value="Others">Others</option>
						</select>
						<textarea className="form-input" name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ gridColumn: '1 / -1' }} />
						<input className="form-input" type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
						<select className="form-input" name="condition" value={form.condition} onChange={handleChange} required>
							<option value="New">New</option>
							<option value="Like New">Like New</option>
							<option value="Good">Good</option>
							<option value="Fair">Fair</option>
							<option value="Poor">Poor</option>
						</select>
						<div style={{ gridColumn: '1 / -1' }}>
							<button className="btn btn-primary" type="submit" disabled={loading}>Add Product</button>
						</div>
					</form>
					{error && <p className="form-error">{error}</p>}
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default AddProduct;
