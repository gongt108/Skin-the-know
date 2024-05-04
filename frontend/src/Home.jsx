import React from 'react';
import Carousel from './components/Carousel';
import ProductGrid from './components/ProductGrid';

function Home() {
	return (
		<div className="h-screen flex flex-col w-full">
			<Carousel />
			<ProductGrid />
		</div>
	);
}

export default Home;
