import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, DropdownItem } from 'flowbite-react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const customTheme = {
	color: {
		primary: {
			base: 'bg-red-500',
			hover: 'hover:bg-red-600',
			dark: 'bg-blue-500', // Dark mode base color
			darkHover: 'hover:bg-blue-600',
		},
	},
};

function ProductPage() {
	const [productInfo, setProductInfo] = useState();
	const [isCollapsed, setIsCollapsed] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const cookies = new Cookies();
	const { slug } = useParams();

	useEffect(() => {
		axios
			.get(`http://localhost:8000/api/product/${slug}`)
			.then((response) => {
				setProductInfo(response.data);
			})
			.catch((err) => {
				console.error('Error retrieving product info:', err);
			});

		axios
			.get('http://localhost:8000/api/session/', {
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': cookies.get('csrftoken'),
				},
				withCredentials: true,
			})
			.then((response) => {
				setIsLoggedIn(response.data.isauthenticated);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [slug]);

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	const addToList = (list) => {
		console.log(list);
		axios
			.put(
				'http://localhost:8000/api/profile/add_to_list/',
				{
					list: list,
					product_pk: 400,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': cookies.get('csrftoken'),
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				// console.log(response.data);
				notify(response.data);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	// dynamically set notification based on button clicked
	const notify = (message) => {
		toast(message, {
			position: 'top-right',
			autoClose: 2000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark',
		});
	};

	return (
		<div className="w-[60rem] mx-auto flex">
			<ToastContainer />
			{productInfo && (
				<div className="flex w-full">
					<div className="w-1/2 h-full p-16 flex flex-col align-middle">
						<img
							src={productInfo.img_url}
							alt="product image"
							className="w-68 p-4 mx-auto"
						/>
						{isLoggedIn && (
							<Dropdown
								dismissOnClick={false}
								className="w-[20rem] bg-white"
								theme={customTheme}
								renderTrigger={() => (
									<span className="text-white  font-semibold bg-teal-500 border-2 border-teal-500 text-center rounded-md p-2 cursor-pointer hover:text-teal-500 hover:bg-white dark:bg-teal-500">
										Add to List
									</span>
								)}
							>
								<DropdownItem
									// as="a"
									// href="/"
									style={{ color: 'inherit', textDecoration: 'none' }}
									onMouseEnter={(e) => (e.target.style.color = '#112554')}
									onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									onClick={() => addToList('favorites')}
									className="font-semibold text-center rounded-md p-2 cursor-pointer hover:text-blue-950"
								>
									Favorites{' '}
								</DropdownItem>
								<DropdownItem
									// as="a"
									// href="/"
									style={{ color: 'inherit', textDecoration: 'none' }}
									onMouseEnter={(e) => (e.target.style.color = '#112554')}
									onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									onClick={() => addToList('purchased')}
									className="font-semibold text-center rounded-md p-2 cursor-pointer hover:text-blue-950"
								>
									Purchased
								</DropdownItem>
								<DropdownItem
									// as="a"
									// href="/"
									style={{ color: 'inherit', textDecoration: 'none' }}
									onMouseEnter={(e) => (e.target.style.color = '#112554')}
									onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									onClick={() => addToList('wishlist')}
									className="font-semibold text-center rounded-md p-2 cursor-pointer hover:text-blue-950"
								>
									Wishlist
								</DropdownItem>
							</Dropdown>
						)}
					</div>
					<div className="w-1/2 h-full">
						<div className="border-b">
							<h2 className="font-semibold text-2xl mt-16">
								{productInfo.name}
							</h2>
							<a href="/" className="text-lg underline text-teal-500">
								{productInfo.brand}
							</a>
							{productInfo.num_reviews === 0 ? (
								<p className="my-4">No reviews yet</p>
							) : (
								{
									/* Render reviews */
								}
							)}
						</div>
						<div>
							{productInfo.ingredients.some(
								(ingredient) => ingredient.avoid_list.length > 0
							) && (
								<div>
									<h4 className="font-semibold text-xl mt-8">
										May cause irritation if used with products that contain:
									</h4>
									<ul className="list-none pe-4">
										{[
											...new Set(
												productInfo.ingredients.flatMap((ingredient) =>
													ingredient.avoid_list.map((item) =>
														item.alias
															? `${item.name} (${item.alias})`
															: item.name
													)
												)
											),
										].join(', ')}
									</ul>
									{isCollapsed && (
										<div
											className="mt-2 text-blue-500 cursor-pointer hover:underline"
											onClick={toggleCollapse}
										>
											Show Breakdown
										</div>
									)}

									{!isCollapsed && (
										<div>
											<div className="flex justify-between mt-4">
												<h4 className="font-semibold text-lg">Breakdown</h4>
												<div
													className="text-blue-500 cursor-pointer hover:underline"
													onClick={toggleCollapse}
												>
													Hide Breakdown
												</div>
											</div>
											<table className="table-auto w-full">
												<thead>
													<tr>
														<th className="w-2/5 px-4 py-2 border">
															Ingredient{' '}
														</th>
														<th className="px-4 py-2 border w-3/5">
															Caution List
														</th>
													</tr>
												</thead>
												<tbody>
													{productInfo.ingredients.map(
														(ingredient, index) =>
															ingredient.avoid_list.length > 0 && (
																<tr key={index}>
																	<td className="border px-4 py-2">
																		<a href={ingredient.incidecoder_url}>
																			{ingredient.name}
																		</a>
																	</td>
																	<td className="border px-4 py-2">
																		{ingredient.avoid_list
																			.map(
																				(avoidItem, avoidIndex) =>
																					avoidItem.name
																			)
																			.join(', ')}
																	</td>
																</tr>
															)
													)}
												</tbody>
											</table>
										</div>
									)}
								</div>
							)}
							<h3 className="font-semibold text-xl mt-8">Ingredients</h3>
							<ul className="list-none mb-8">
								{productInfo.ingredients
									.map((ingredient, index) => ingredient.name)
									.join(', ')}
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ProductPage;
