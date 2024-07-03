import { useEffect, useState } from "react";
import Header from "../header/Header";

export default function CategoriesMenu({ onClick }) {
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);

	const getCategories = async () => {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
		if (response.ok) {
			const result = await response.json();
			setCategories(result);
		}
	};

	const handleCategory = (category) => {
		onClick(category);
	};

	useEffect(() => {
		getCategories();
	}, []);

	return (
		<div className='w-2/3 h-screen flex flex-col mx-auto'>
			<Header title={"Выбор категории игры"} />
			<div className='w-1/2 flex flex-col self-center my-auto gap-4 bg-slate-400 p-4 rounded-lg'>
				<select
					onChange={(e) => setSelectedCategory(JSON.parse(e.target.value))}
					defaultValue={"null"}
					className='w-full text-2xl rounded-lg p-4'
				>
					<option
						value='null'
						disabled
					>
						Выберите категорию
					</option>
					{categories.map((category) => (
						<option
							value={JSON.stringify(category)}
							className='w-2/3 text-2xl'
							key={category.id}
						>
							{category.title}
						</option>
					))}
				</select>
				<button
					onClick={() => handleCategory(selectedCategory)}
					className='w-full text-2xl p-4 bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-lg'
				>
					Начать игру
				</button>
			</div>
		</div>
	);
}
