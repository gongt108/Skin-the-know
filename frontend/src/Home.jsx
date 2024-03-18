import React from 'react';
import Carousel from './components/Carousel';
import ProductGrid from './components/ProductGrid';

function Home() {
	return (
		<div className="h-screen">
			<Carousel />
			<ProductGrid />
		</div>
	);
}

export default Home;
