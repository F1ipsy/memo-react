import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/Header";

export default function EditCategoryTitle() {
	const categoryId = useParams().id;
	const [category, setCategory] = useState({});
	const [oldTitle, setOldTitle] = useState("");
	const [newTitle, setNewTitle] = useState("");
	const inputRef = useRef(null);
	const navigate = useNavigate();

	const getCategory = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/categories/${categoryId}`
		);

		if (response.ok) {
			const result = await response.json();
			setCategory(result);
			setOldTitle(result.title);
			setNewTitle(result.title);
		}
	};

	const editCategoryTitle = async (e) => {
		e.preventDefault();

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title: newTitle }),
			}
		);

		if (response.ok) {
			navigate("/categories");
		} else {
			const result = await response.json();
			alert(
				`Произошла ошибка\n Status: ${response.status}\n Message: ${result.message}`
			);
		}
	};

	useEffect(() => {
		getCategory();
	}, []);

	useEffect(() => {
		const length = category?.title?.length; // длина текста
		inputRef.current.setSelectionRange(length, length); // устанавливаем курсор в конец строки
	}, [category]);

	return (
		<div className='w-2/3 mx-auto'>
			<Header title={`Изменение названия категории "${oldTitle}"`} />
			<form onSubmit={editCategoryTitle}>
				<div className='w-full flex my-6 gap-x-4'>
					<input
						ref={inputRef}
						type='text'
						onInput={(e) => setNewTitle(e.target.value)}
						defaultValue={oldTitle}
						autoFocus
						className='w-4/5 text-2xl border-2 border-slate-300 rounded-lg p-4'
						placeholder='Введите новое название категории'
					/>
					<button
						type='submit'
						className='w-1/5 text-2xl bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-lg'
					>
						Сохранить
					</button>
				</div>
			</form>
		</div>
	);
}
