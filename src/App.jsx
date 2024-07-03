import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import EditCategoryTitle from "./pages/category/edit";
import Cards from "./pages/Cards";
import EditCard from "./pages/card/edit";

export default function App() {
	return (
		<Routes>
			<Route
				path='/'
				element={<Home />}
			/>
			<Route
				path='/categories'
				element={<Categories />}
			/>
			<Route
				path='/categories/edit/:id'
				element={<EditCategoryTitle />}
			/>
			<Route
				path='/categories/:id/cards'
				element={<Cards />}
			/>
			<Route
				path='/cards/edit/:id'
				element={<EditCard />}
			/>
		</Routes>
	);
}
