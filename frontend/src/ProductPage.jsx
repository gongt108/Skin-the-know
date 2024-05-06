import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, DropdownItem } from 'flowbite-react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { FaRegStar, FaStar } from 'react-icons/fa';
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
	const [isRating, setIsRating] = useState(false);
	const [userReview, setUserReview] = useState(null);
	const [newRating, setNewRating] = useState(userReview);
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
			.get('http://localhost:8000/api/products/get_user_rating/', {
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': cookies.get('csrftoken'),
				},
				params: {
					slug: slug,
				},
				withCredentials: true,
			})
			.then((response) => {
				const data = response.data;
				if (!data.isauthenticated) {
					setIsLoggedIn(false);
				} else {
					setIsLoggedIn(true);
					setUserReview(data.user_review);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}, [slug]);

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	const saveRating = (e) => {
		e.preventDefault();
		if (newRating) {
			console.log(newRating);
			axios
				.put(
					'http://localhost:8000/api/products/get_user_rating/',
					{ new_rating: newRating },
					{
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': cookies.get('csrftoken'),
						},
						params: {
							slug: slug,
						},
						withCredentials: true,
					}
				)
				.then((response) => {
					console.log(response.data);
					const data = response.data;
					if (!data.isauthenticated) {
						setIsLoggedIn(false);
					} else {
						setIsLoggedIn(true);
						setUserReview(data.user_review);
						setIsRating(false);
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};

	const addToList = (list) => {
		axios
			.put(
				'http://localhost:8000/api/profile/add_to_list/',
				{
					list: list,
					product_pk: productInfo.id,
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
									style={{ color: 'inherit', textDecoration: 'none' }}
									onMouseEnter={(e) => (e.target.style.color = '#112554')}
									onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									onClick={() => addToList('favorites')}
									className="font-semibold text-center rounded-md p-2 cursor-pointer hover:text-blue-950"
								>
									Favorites{' '}
								</DropdownItem>
								<DropdownItem
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
								{productInfo.brand.name}
							</a>
							<div className="flex items-center mb-2 justify-between">
								{productInfo.num_reviews === 0 ? (
									<p className="my-4">No reviews yet</p>
								) : (
									<div className="flex items-center mb-2 justify-between">
										<div className="flex flex-col">
											<div className="flex items-center">
												{productInfo.rating}
												<FaStar className="ms-1 " />
											</div>
											{productInfo.num_reviews} Review(s)
										</div>
									</div>
								)}
								{isLoggedIn && (
									<div className="flex items-center relative">
										{userReview ? (
											<div className="flex flex-col">
												<div className="flex justify-end">
													My rating:
													<div
														className="ms-1 underline cursor-pointer hover:text-teal-500"
														onClick={() => setIsRating(true)}
													>
														{userReview}
													</div>
												</div>
											</div>
										) : (
											<div
												className="underline cursor-pointer hover:text-teal-500"
												onClick={() => setIsRating(true)}
											>
												Add a Rating
											</div>
										)}
									</div>
								)}
							</div>
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
			{isRating && (
				<div
					className="absolute top-0 left-0 flex justify-center h-full w-full bg-gray-800 bg-opacity-30"
					onClick={(e) => {
						if (e.currentTarget === e.target) {
							setIsRating(false);
							setNewRating(null);
						}
					}}
				>
					<div className="absolute w-[15rem] top-1/3 border rounded-md bg-white py-2 px-4">
						<div className="flex w-full justify-between">
							<h3 className="mb-2">Add/Change Rating</h3>
							<p
								className="hover:underline cursor-pointer text-gray-400"
								onClick={() => {
									setIsRating(false);
									setNewRating(null);
								}}
							>
								X
							</p>
						</div>
						<form
							action="#"
							className="flex flex-col ms-2"
							onChange={(e) => {
								setNewRating(e.target.value);
							}}
						>
							<label htmlFor="star1" className="inline-flex items-center">
								<input
									type="radio"
									name="rating"
									id="star1"
									value="1"
									className="mr-1"
								/>
								<span>
									<FaStar />
								</span>
							</label>
							<label htmlFor="star2" className="inline-flex items-center">
								<input
									type="radio"
									name="rating"
									id="star2"
									value="2"
									className="mr-1"
								/>
								<span className="flex">
									<FaStar />
									<FaStar />
								</span>
							</label>
							<label htmlFor="star3" className="inline-flex items-center">
								<input
									type="radio"
									name="rating"
									id="star3"
									value="3"
									className="mr-1"
								/>
								<span className="flex">
									<FaStar />
									<FaStar />
									<FaStar />
								</span>
							</label>
							<label htmlFor="star4" className="inline-flex items-center">
								<input
									type="radio"
									name="rating"
									id="star4"
									value="4"
									className="mr-1"
								/>
								<span className="flex">
									<FaStar />
									<FaStar />
									<FaStar />
									<FaStar />
								</span>
							</label>
							<label htmlFor="star5" className="inline-flex items-center">
								<input
									type="radio"
									name="rating"
									id="star5"
									value="5"
									className="mr-1"
								/>
								<span className="flex">
									<FaStar />
									<FaStar />
									<FaStar />
									<FaStar />
									<FaStar />
								</span>
							</label>
							<button className="mt-2 hover:underline" onClick={saveRating}>
								Save
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default ProductPage;
