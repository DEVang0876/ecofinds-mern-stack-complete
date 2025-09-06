
import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const Products = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const limit = 12;
	const observerRef = useRef(null);

	const fetchProducts = useCallback(async (pageToLoad = 1) => {
		try {
			if (pageToLoad === 1) {
				setLoading(true);
				setError(null);
			} else {
				setIsLoadingMore(true);
			}
			const res = await api.get(`/products?page=${pageToLoad}&limit=${limit}`);
			const newItems = res.data.data || [];
			const pagination = res.data.pagination;
			setProducts(prev => pageToLoad === 1 ? newItems : [...prev, ...newItems]);
			if (pagination) {
				setHasMore(pagination.hasNextPage);
			} else {
				// Fallback if no pagination info
				setHasMore(newItems.length === limit);
			}
		} catch (err) {
			setError('Failed to load products');
		} finally {
			setLoading(false);
			setIsLoadingMore(false);
		}
	}, []);

	// Initial load
	useEffect(() => { fetchProducts(1); }, [fetchProducts]);

	// Intersection Observer for infinite scroll
	const lastItemRef = useCallback(node => {
		if (loading || isLoadingMore) return;
		if (observerRef.current) observerRef.current.disconnect();
		observerRef.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && hasMore) {
				const nextPage = page + 1;
				setPage(nextPage);
				fetchProducts(nextPage);
			}
		}, { rootMargin: '200px' });
		if (node) observerRef.current.observe(node);
	}, [loading, isLoadingMore, hasMore, page, fetchProducts]);

	if (loading) return <div>Loading products...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className="container" style={{paddingTop:'1rem', paddingBottom:'2rem'}}>
			<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
				<h2 style={{margin:0, fontSize:'1.4rem'}}>Products</h2>
			</div>
			{products.length === 0 ? (
				<p>No products found.</p>
			) : (
				<div className="grid cols-4">
					{products.map((p, idx) => {
						if (idx === products.length - 1) {
							return <div key={p._id} ref={lastItemRef}><ProductCard product={p} /></div>;
						}
						return <ProductCard key={p._id} product={p} />;
					})}
				</div>
			)}
			{isLoadingMore && <div style={{marginTop:16}}>Loading more...</div>}
			{!hasMore && products.length > 0 && <div style={{marginTop:16, opacity:0.6}}>No more products.</div>}
		</div>
	);
};

export default Products;
