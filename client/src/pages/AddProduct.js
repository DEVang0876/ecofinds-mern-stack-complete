
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
						<select name="category" value={form.category} onChange={handleChange} required>
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
						<select name="condition" value={form.condition} onChange={handleChange} required>
							<option value="New">New</option>
							<option value="Like New">Like New</option>
							<option value="Good">Good</option>
							<option value="Fair">Fair</option>
							<option value="Poor">Poor</option>
						</select>
				<button type="submit" disabled={loading}>Add Product</button>
			</form>
			{error && <p className="error">{error}</p>}
			<ToastContainer />
		</div>
	);
};

export default AddProduct;
