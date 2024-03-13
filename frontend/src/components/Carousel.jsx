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
		setCurrentSlide((prevSlide) => (prevSlide === 4 ? 0 : prevSlide + 1));
	};

	const prevSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide === 0 ? 4 : prevSlide - 1));
	};

	return (
		<div
			id="default-carousel"
			className="relative w-full h-1/2"
			data-carousel="slide"
		>
			{/* Carousel wrapper */}
			<div className="relative h-full overflow-hidden rounded-lg">
				{/* Carousel items */}
				{data.map((item, index) => (
					<div
						key={index}
						className={`duration-700 h-full ease-in-out relative text-center ${
							index === currentSlide ? '' : 'hidden'
						}`}
						data-carousel-item
					>
						<div className="absolute bottom-0 w-full bg-slate-500 text-center z-10">
							<h2 className=" text-white font-semibold text-center z-10">
								{item.title}
							</h2>
						</div>
						<img
							src={item.imgSrc}
							className="flex object-cover mx-auto w-1/2 "
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
			</button>
			<button
				type="button"
				className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
				data-carousel-next
				onClick={nextSlide}
			>
				{/* Next button */}
			</button>
		</div>
	);
}

export default Carousel;
