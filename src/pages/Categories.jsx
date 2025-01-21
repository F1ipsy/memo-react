import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";

export default function Categories() {
	const [title, setTitle] = useState("");
	const [instruction, setInstruction] = useState("");
	const [categories, setCategories] = useState([]);

	const getCategories = async () => {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
		if (response.ok) {
			const result = await response.json();
			setCategories(result);
		}
	};

	const createCategory = async (e) => {
		e.preventDefault();

		const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title, instruction }),
		});
		const result = await response.json();

		if (response.ok) {
			setCategories([...categories, result]);
			setTitle("");
			setInstruction("");
		} else {
			alert(
				`Произошла ошибка\n Status: ${response.status}\n Message: ${result.message}`
			);
		}
	};

	const deleteCategory = async (categoryId) => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
			{
				method: "DELETE",
			}
		);
		if (response.ok) {
			getCategories();
		}
	};

	useEffect(() => {
		getCategories();
	}, []);

	return (
		<div className='w-2/3 mx-auto'>
			<Header title={"Категории"} />
			<form onSubmit={createCategory}>
				<div className='w-full border-2 border-slate-300 bg-slate-100 rounded-lg flex flex-col my-6 p-4 gap-y-4'>
					<input
						type='text'
						value={title}
						onInput={(e) => setTitle(e.target.value)}
						className='text-2xl border-2 border-slate-300 rounded-lg p-4'
						placeholder='Введите название категории'
					/>
					<textarea
						value={instruction}
						onInput={(e) => setInstruction(e.target.value)}
						className='text-2xl border-2 min-h-20 border-slate-300 rounded-lg p-4'
						placeholder='Инструкция к категории'
					/>
					<button
						type='submit'
						className='text-2xl p-4 bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-lg'
					>
						Создать
					</button>
				</div>
			</form>
			<div className='flex flex-col border-2 border-slate-300 bg-slate-100 gap-y-4 p-4 rounded-lg'>
				{categories.map((category) => (
					<div
						key={category.id}
						className='flex gap-4'
					>
						<Link
							to={`${category.id}/cards`}
							className='w-full text-2xl bg-white border-2 border-slate-300 hover:bg-gradient-to-b from-white to-slate-200 p-4 rounded-lg cursor-pointer'
						>
							{category.title}
						</Link>
						<Link
							to={`edit/${category.id}`}
							className='grid place-content-center text-white text-xl bg-blue-500 hover:bg-gradient-to-t from-blue-500 to-blue-400 px-6 py-4 rounded-lg'
						>
							Редактировать
						</Link>
						<button
							type='submit'
							onClick={() => deleteCategory(category.id)}
							className='grid place-content-center text-white text-xl bg-red-500 hover:bg-gradient-to-t from-red-500 to-red-400 px-6 py-4 rounded-lg'
						>
							Удалить
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
