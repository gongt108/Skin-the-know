import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Home from './Home';
import Layout from './components/Layout';
import AddProduct from './AddProduct';
import BrandPage from './BrandPage';
import Brands from './Brands';
import CategoryPage from './CategoryPage';
import IngredientsList from './IngredientsList';
import ListPage from './ListPage';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import ProductPage from './ProductPage';
import Profile from './Profile';
import Schedule from './Schedule';
import ScheduleEdit from './components/ScheduleEdit';
import SearchResults from './SearchResults';
import Signup from './components/auth/Signup';
import './input.css';

//instantiating Cookies class by creating cookies object
const cookies = new Cookies();

const App = () => {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" exact element={<Home />} />
					<Route path="/addproduct" element={<AddProduct />} />
					<Route path="/brand/:slug" element={<BrandPage />} />
					<Route path="/brands" element={<Brands />} />
					<Route path="/category" element={<CategoryPage />} />
					<Route path="/ingredients" element={<IngredientsList />} />
					<Route path="/mylists/:listName" element={<ListPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/logout" element={<Logout />} />
					<Route path="/product/:slug" element={<ProductPage />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/schedule" element={<Schedule />} />
					<Route path="/schedule/:param1" element={<ScheduleEdit />} />
					<Route path="/search" element={<SearchResults />} />
					<Route path="/signup" element={<Signup />} />
				</Routes>
			</Layout>
		</Router>
	);
};

export default App;
