
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

// Allowed enums mirror backend Product schema
const CATEGORIES = [
	'Electronics','Clothing','Books','Furniture','Sports','Toys','Vehicles','Home & Garden','Health & Beauty','Others'
];
const CONDITIONS = ['New','Like New','Good','Fair','Poor'];

const AddProduct = () => {
	const navigate = useNavigate();
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
	const [images, setImages] = useState([]); // file objects
	const [imageUrlText, setImageUrlText] = useState(''); // multiline or comma separated
	const [parsedImageUrls, setParsedImageUrls] = useState([]); // validated urls preview
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleImagesChange = (e) => {
		setImages(Array.from(e.target.files).slice(0,5));
	};

	const parseImageUrls = (raw) => {
		return raw
			.split(/\n|,/)
			.map(s => s.trim())
			.filter(s => /^https?:\/\//i.test(s));
	};

	const handleImageUrlChange = (e) => {
		const val = e.target.value;
		setImageUrlText(val);
		const list = parseImageUrls(val).slice(0,5);
		setParsedImageUrls(list);
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
			// Only send imageUrls if no files selected (backend prefers uploaded files)
			if (images.length === 0 && parsedImageUrls.length) {
				fd.append('imageUrls', parsedImageUrls.join(','));
			}
			const res = await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
			toast.success('Product added!');
			setForm({ title: '', description: '', price: '', category: 'Electronics', condition: 'Good', quantity: 1, tags: '', city: '', state: '' });
			setImages([]);
			setImageUrlText('');
			setParsedImageUrls([]);
			// Redirect to My Listings so the user can see the new product
			setTimeout(() => navigate('/my-listings'), 600);
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
		<div className="container" style={{padding:'32px 0'}}>
			<div className="card" style={{maxWidth:960, margin:'0 auto', padding:'32px 40px'}}>
				<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
					<h2 style={{margin:0, fontSize:'1.75rem'}}>Add New Product</h2>
					<span style={{fontSize:12, color:'var(--color-text-light)'}}>{images.length ? images.length : parsedImageUrls.length} / 5 images</span>
				</div>
				<form onSubmit={handleSubmit} style={{display:'grid', gap:32, gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
					<section style={{display:'flex', flexDirection:'column', gap:16}}>
						<div className="form-group">
							<label className="form-label">Title</label>
							<input className="input" type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Mountain Bike" required />
						</div>
						<div className="form-group">
							<label className="form-label">Description</label>
							<textarea className="input" name="description" value={form.description} onChange={handleChange} placeholder="Describe the item condition, features..." required style={{minHeight:140}} />
						</div>
						<div className="form-group" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12}}>
							<div>
								<label className="form-label">Price ($)</label>
								<input className="input" type="number" name="price" value={form.price} onChange={handleChange} min="0" placeholder="0.00" required />
							</div>
							<div>
								<label className="form-label">Quantity</label>
								<input className="input" type="number" name="quantity" value={form.quantity} onChange={handleChange} min="1" />
							</div>
						</div>
						<div className="form-group" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12}}>
							<div>
								<label className="form-label">Category</label>
								<select className="input" name="category" value={form.category} onChange={handleChange} required>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
							</div>
							<div>
								<label className="form-label">Condition</label>
								<select className="input" name="condition" value={form.condition} onChange={handleChange} required>{CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}</select>
							</div>
						</div>
						<div className="form-group">
							<label className="form-label">Tags</label>
							<input className="input" type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="comma,separated,tags" />
						</div>
						<div className="form-group" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12}}>
							<div>
								<label className="form-label">City</label>
								<input className="input" type="text" name="city" value={form.city} onChange={handleChange} />
							</div>
							<div>
								<label className="form-label">State</label>
								<input className="input" type="text" name="state" value={form.state} onChange={handleChange} />
							</div>
						</div>
					</section>
					<section style={{display:'flex', flexDirection:'column', gap:16}}>
						<div className="form-group">
							<label className="form-label">Upload Images (max 5)</label>
							<input className="input" type="file" multiple accept="image/*" onChange={handleImagesChange} />
							{images.length > 0 && <p style={{fontSize:12, marginTop:6}}>{images.length} selected</p>}
						</div>
						<div className="form-group">
							<label className="form-label">Or Image URLs</label>
							<textarea className="input" placeholder="https://example.com/img1.jpg\nhttps://example.com/img2.jpg" value={imageUrlText} onChange={handleImageUrlChange} style={{minHeight:120}} />
							<small style={{display:'block', marginTop:4, color:'var(--color-text-light)'}}>Paste up to 5 URLs (newline or comma separated). Files override URLs.</small>
							{parsedImageUrls.length > 0 && images.length === 0 && (
								<div style={{display:'flex', flexWrap:'wrap', gap:10, marginTop:12}}>
									{parsedImageUrls.map(u => (
										<div key={u} style={{width:90, height:90, border:'1px solid var(--color-border)', borderRadius:8, overflow:'hidden', boxShadow:'var(--shadow-sm)'}}>
											<img src={u} alt="preview" style={{width:'100%', height:'100%', objectFit:'cover'}} />
										</div>
									))}
								</div>
							)}
						</div>
						<div className="form-group" style={{marginTop:8}}>
							<button className="button" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Product'}</button>
						</div>
						{error && <div className="form-error" style={{whiteSpace:'pre-wrap'}}>{error}</div>}
					</section>
				</form>
				<ToastContainer />
			</div>
		</div>
	);
};

export default AddProduct;
