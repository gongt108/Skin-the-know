import React, { useState } from 'react';

const data = [
	{
		title: 'Featured Product',
		name: 'Isntree Chestnut AHA',
		imgSrc:
			'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/31/873/L_g0198487331.jpg',
	},
	{
		title: 'Featured Ingredient',
		name: 'Isntree Chestnut AHA',
		imgSrc:
			'https://d1flfk77wl2xk4.cloudfront.net/Assets/GalleryImage/35/873/L_g0198487335_000.jpg',
	},
	{
		title: 'Featured Brand',
		name: 'Romand',
		imgSrc:
			'https://romand.us/cdn/shop/files/rom_nd_320x_7246b694-593c-4131-a8bb-45e3e19cf74b.png?v=1658868558&width=140',
	},
];
function Carousel({ props }) {
	const [currentSlide, setCurrentSlide] = useState(0);

	const goToSlide = (slideIndex) => {
		setCurrentSlide(slideIndex);
	};

	const nextSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide === 2 ? 0 : prevSlide + 1));
	};

	const prevSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide === 0 ? 2 : prevSlide - 1));
	};

	return (
		<div
			id="default-carousel"
			className="relative w-1/2 h-1/2 mx-auto"
			data-carousel="slide"
		>
			{/* Carousel wrapper */}
			<div className="relative h-full overflow-hidden rounded-lg w-full mx-auto">
				{/* Carousel items */}
				{data.map((item, index) => (
					<div
						key={index}
						className={`duration-700 h-full ease-in-out relative text-center ${
							index === currentSlide ? '' : 'hidden'
						}`}
						data-carousel-item
					>
						<div className="absolute top-0 bg-slate-500/50 w-full text-center z-10">
							<h2 className="text-3xl flex items-center justify-center text-white font-semibold text-center z-10 h-16">
								{item.title}
							</h2>
						</div>
						<img
							src={item.imgSrc}
							className="flex object-cover w-full "
							alt={item.title}
						/>
					</div>
				))}
			</div>
			{/* Slider indicators */}
			<div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
				{[...Array(3)].map((_, index) => (
					<button
						key={index}
						type="button"
						className={`w-3 h-3 rounded-full ${
							index === currentSlide ? 'bg-gray-500' : 'bg-gray-200'
						}`}
						aria-current={index === currentSlide}
						aria-label={`Slide ${index + 1}`}
						data-carousel-slide-to={index}
						onClick={() => goToSlide(index)}
					/>
				))}
			</div>
			{/* Slider controls */}
			<button
				type="button"
				className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
				data-carousel-prev
				onClick={prevSlide}
			>
				{/* Previous button */}
				<span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
					<svg
						class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 6 10"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 1 1 5l4 4"
						/>
					</svg>
					<span class="sr-only">Previous</span>
				</span>
			</button>
			<button
				type="button"
				className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
				data-carousel-next
				onClick={nextSlide}
			>
				{/* Next button */}
				<span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
					<svg
						class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 6 10"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 9 4-4-4-4"
						/>
					</svg>
					<span class="sr-only">Next</span>
				</span>
			</button>
		</div>
	);
}

export default Carousel;
