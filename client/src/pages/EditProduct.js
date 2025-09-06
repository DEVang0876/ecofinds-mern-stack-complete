
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
			const payload = {
				title: form.title,
				description: form.description,
				price: Number(form.price),
				category: form.category,
				condition: form.condition
			};
			await api.put(`/products/${id}`, payload);
			toast.success('Product updated!');
		} catch (err) {
			setError('Failed to update product');
			toast.error('Failed to update product');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="edit-product-page container">
			<div className="card" style={{ maxWidth: 900, margin: '2rem auto' }}>
				<div className="card-body">
					<h2 style={{ marginBottom: 12 }}>Edit Product</h2>
					<form onSubmit={handleSubmit} className="grid md-grid-cols-2 gap-4">
						<input className="form-input" type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
						<input className="form-input" type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
						<textarea className="form-input" name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ gridColumn: '1 / -1' }} />
						<input className="form-input" type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
						<select className="form-input" name="condition" value={form.condition} onChange={handleChange}>
							<option value="new">New</option>
							<option value="used">Used</option>
						</select>
						<div style={{ gridColumn: '1 / -1' }}>
							<button className="btn btn-primary" type="submit" disabled={loading}>Update Product</button>
						</div>
					</form>
					{error && <p className="form-error">{error}</p>}
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default EditProduct;
