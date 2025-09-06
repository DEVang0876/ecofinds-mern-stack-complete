export const PLACEHOLDER = {
	url: 'https://via.placeholder.com/600x600/059669/ffffff?text=EcoFinds',
	alt: 'Placeholder'
};

export function getPrimaryImage(product) {
	if (!product) return PLACEHOLDER;
	if (product.images && product.images.length) {
		const first = product.images[0];
		if (typeof first === 'string') return { url: first, alt: product.title };
		if (first.url) return { url: first.url, alt: first.alt || product.title };
	}
	return PLACEHOLDER;
}
