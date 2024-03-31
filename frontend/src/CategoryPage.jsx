import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

import ProductwithNameCard from './components/ProductwithNameCard';

function CategoryPage() {
	const [searchParams] = useSearchParams();
	const query = searchParams.get('query');
	const [skinConcern, setSkinConcern] = useState();
	const [products, setProducts] = useState();
	const [ingredients, setIngredients] = useState();
	const [filter, setFilter] = useState('all');

	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/skinconcern/get_products/', {
				params: {
					query: query,
					filter: filter,
				},
			})
			.then((response) => {
				let data = response.data;
				setSkinConcern(data['skin_concern']);
				setIngredients(data['ingredients']);
				setProducts(data['products']);
			})
			.catch((err) => {
				console.error('Error retrieving products:', err);
			});
	}, [query, filter]);
	console.log(ingredients);

	const filterSelection = (ingredient) => {
		setFilter(ingredient.id);
	};

	return (
		<div className="w-[60rem] mx-auto flex mt-4 flex-col">
			<div className="ms-4 mt-4 text-xl">
				Top products for{' '}
				{skinConcern && (
					<span className="font-bold text-xl">{skinConcern['name']}:</span>
				)}
			</div>
			<div className="grid grid-cols-5 gap-4 mt-4">
				<div className="flex flex-col col-span-1 bg-slate-100 h-full">
					<h3 className="mt-4 mb-2 ps-4 pb-2 font-semibold border-b">
						Filter by active:
					</h3>

					<div className="flex flex-col ms-4 w-fit h-full">
						<div
							className={`flex mb-1 cursor-pointer ${
								filter === 'all' ? 'font-bold' : ''
							}`}
							onClick={() => setFilter('all')}
						>
							View all
						</div>
						{ingredients &&
							ingredients.map((ingredient, i) => (
								<div
									className={`flex mb-1 cursor-pointer ${
										filter === ingredient.id ? 'font-bold' : ''
									}`}
									key={ingredient.id}
									onClick={() => filterSelection(ingredient)}
								>
									{ingredient.name}
								</div>
							))}
					</div>
				</div>
				<div className="grid grid-cols-4 gap-4 col-span-4">
					{products &&
						products.map((product, i) => (
							<ProductwithNameCard key={i} product={product} />
						))}
				</div>
			</div>
		</div>
	);
}

export default CategoryPage;
