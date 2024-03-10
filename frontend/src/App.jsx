import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import './input.css';

//instantiating Cookies class by creating cookies object
const cookies = new Cookies();

const App = () => {
	return (
		<Router>
			<Layout>
				<Routes>
					{/* <Route path="/" exact component={Home} /> */}
					<Route path="/login" element={<Login />} />
					{/* <Route path="/signup" component={Signup} /> */}
				</Routes>
			</Layout>
		</Router>
		// <h1 className="text-3xl font-bold underline">Hello world!</h1>
	);
};

export default App;
