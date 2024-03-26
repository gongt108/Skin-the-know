import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Home from './Home';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProductPage from './ProductPage';
import AddProduct from './AddProduct';
import IngredientsList from './IngredientsList';
import Brands from './Brands';
import './input.css';

//instantiating Cookies class by creating cookies object
const cookies = new Cookies();

const App = () => {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" exact element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/addproduct" element={<AddProduct />} />
					<Route path="/product/:slug" element={<ProductPage />} />
					<Route path="/ingredients" element={<IngredientsList />} />
					<Route path="/brands" element={<Brands />} />
				</Routes>
			</Layout>
		</Router>
		// <h1 className="text-3xl font-bold underline">Hello world!</h1>
	);
};

export default App;
