
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

const EditProduct = () => {
	const { id } = useParams();
	const [form, setForm] = useState({
		title: '',
		description: '',
		price: '',
		category: '',
		condition: 'new'
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await api.get(`/products/${id}`);
				const p = res.data.data || res.data.product;
				setForm({
					title: p.title || '',
					description: p.description || '',
					price: p.price || '',
					category: p.category || '',
					condition: p.condition || 'new'
				});
			} catch (err) {
				setError('Failed to load product');
			}
		};
		fetchProduct();
	}, [id]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await api.put(`/products/${id}`, form);
			toast.success('Product updated!');
		} catch (err) {
			setError('Failed to update product');
			toast.error('Failed to update product');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="edit-product-page">
			<h2>Edit Product</h2>
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
				<button type="submit" disabled={loading}>Update Product</button>
			</form>
			{error && <p className="error">{error}</p>}
			<ToastContainer />
		</div>
	);
};

export default EditProduct;
