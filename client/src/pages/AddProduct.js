
import React, { useState } from 'react';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

const AddProduct = () => {
	const [form, setForm] = useState({
		title: '',
		description: '',
		price: '',
		category: '',
		condition: 'new'
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
			await api.post('/products', form);
			toast.success('Product added!');
			setForm({ title: '', description: '', price: '', category: '', condition: 'new' });
		} catch (err) {
			setError('Failed to add product');
			toast.error('Failed to add product');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add-product-page">
			<h2>Add Product</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="title"
					placeholder="Title"
					value={form.title}
					onChange={handleChange}
					required
				/>
				<textarea
					name="description"
					placeholder="Description"
					value={form.description}
					onChange={handleChange}
					required
				/>
				<input
					type="number"
					name="price"
					placeholder="Price"
					value={form.price}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="category"
					placeholder="Category"
					value={form.category}
					onChange={handleChange}
				/>
				<select name="condition" value={form.condition} onChange={handleChange}>
					<option value="new">New</option>
					<option value="used">Used</option>
				</select>
				<button type="submit" disabled={loading}>Add Product</button>
			</form>
			{error && <p className="error">{error}</p>}
			<ToastContainer />
		</div>
	);
};

export default AddProduct;
