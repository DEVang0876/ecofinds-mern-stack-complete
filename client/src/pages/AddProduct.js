
import React, { useState } from 'react';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

// Allowed enums mirror backend Product schema
const CATEGORIES = [
	'Electronics','Clothing','Books','Furniture','Sports','Toys','Vehicles','Home & Garden','Health & Beauty','Others'
];
const CONDITIONS = ['New','Like New','Good','Fair','Poor'];

const AddProduct = () => {
	const [form, setForm] = useState({
		title: '',
		description: '',
		price: '',
		category: 'Electronics',
		condition: 'Good',
		quantity: 1,
		tags: '',
		city: '',
		state: ''
	});
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleImagesChange = (e) => {
		setImages(Array.from(e.target.files).slice(0,5));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			// Validate basics
			const clientErrors = [];
			if (!form.title) clientErrors.push('Title is required');
			if (!form.description) clientErrors.push('Description is required');
			if (form.description && form.description.trim().length < 10) clientErrors.push('Description must be at least 10 characters');
			if (!form.price) clientErrors.push('Price is required');
			if (Number(form.price) < 0) clientErrors.push('Price must be positive');
			if (!CATEGORIES.includes(form.category)) clientErrors.push('Invalid category');
			if (!CONDITIONS.includes(form.condition)) clientErrors.push('Invalid condition');
			if (clientErrors.length) {
				throw new Error(clientErrors.join('\n'));
			}
			const fd = new FormData();
			fd.append('title', form.title.trim());
			fd.append('description', form.description.trim());
			fd.append('price', form.price);
			fd.append('category', form.category);
			fd.append('condition', form.condition);
			fd.append('quantity', form.quantity);
			if (form.tags) fd.append('tags', form.tags);
			// Location as nested object (backend expects location field); send JSON string
			const location = {};
			if (form.city) location.city = form.city;
			if (form.state) location.state = form.state;
			if (Object.keys(location).length) fd.append('location', JSON.stringify(location));
			images.forEach(img => fd.append('images', img));
			const res = await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
			toast.success('Product added!');
			setForm({ title: '', description: '', price: '', category: 'Electronics', condition: 'Good', quantity: 1, tags: '', city: '', state: '' });
			setImages([]);
		} catch (err) {
			let msg = err?.response?.data?.message || err.message || 'Failed to add product';
			// Collect server validation errors if present
			if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
				const detail = err.response.data.errors.map(er => `${er.field}: ${er.message}`).join('\n');
				msg = `${msg}\n${detail}`;
			}
			setError(msg);
			// Show only first line in toast for brevity
			toast.error(msg.split('\n')[0]);
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
					{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
				</select>
				<select name="condition" value={form.condition} onChange={handleChange} required>
					{CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
				</select>
				<input
					type="number"
					name="quantity"
					min="1"
					value={form.quantity}
					onChange={handleChange}
					placeholder="Quantity"
				/>
				<input
					type="text"
					name="tags"
					value={form.tags}
					onChange={handleChange}
					placeholder="Tags (comma separated)"
				/>
				<input
					type="text"
					name="city"
					value={form.city}
					onChange={handleChange}
					placeholder="City"
				/>
				<input
					type="text"
					name="state"
					value={form.state}
					onChange={handleChange}
					placeholder="State"
				/>
				<input
					type="file"
					multiple
					accept="image/*"
					onChange={handleImagesChange}
				/>
				{images.length > 0 && <p>{images.length} image(s) selected</p>}
				<button type="submit" disabled={loading}>Add Product</button>
			</form>
			{error && <pre className="error" style={{whiteSpace:'pre-wrap',color:'red'}}>{error}</pre>}
			<ToastContainer />
		</div>
	);
};

export default AddProduct;
