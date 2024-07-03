import Header from "../../components/header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function EditCard() {
	const checkbox = useRef(null);
	const inputRef = useRef(null);
	const navigate = useNavigate();
	const { id } = useParams();
	const [categoryId, setCategoryId] = useState("");
	const [card, setCard] = useState(null);
	const [alt, setAlt] = useState("");
	const [image, setImage] = useState("");
	const [alternateImage, setAlternateImage] = useState("");
	const [setting, setSetting] = useState("");

	const handleSetting = (checkboxValue) => {
		if (setting === "alternate") {
			setSetting("");
		} else {
			setSetting(checkboxValue);
		}
	};

	const getCard = async () => {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/cards/${id}`);
		if (response.ok) {
			const result = await response.json();
			setCard(result);
			setAlt(result.alt);
			setImage(result.image);
			setAlternateImage(result.alternateImage);
			setCategoryId(result.categoryId);
		}
	};

	const updateCard = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("alt", alt);
		formData.append("image", image);
		formData.append("alternateImage", alternateImage);
		formData.append("setting", setting);

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/cards/${id}`,
			{
				method: "PATCH",
				body: formData,
			}
		);

		if (response.ok) {
			navigate(`/categories/${categoryId}/cards`);
		} else {
			const result = await response.json();
			alert(result.message);
		}
	};

	useEffect(() => {
		getCard();
	}, []);

	useEffect(() => {
		const length = card?.alt?.length; // длина текста
		inputRef.current.setSelectionRange(length, length); // устанавливаем курсор в конец строки
	}, [card]);

	return (
		<div className='w-2/3 mx-auto'>
			<Header title={`Редактирование карточки "${card?.alt}"`} />
			<form>
				<div className='w-full flex my-6 gap-x-4'>
					<input
						ref={inputRef}
						type='text'
						defaultValue={card?.alt}
						autoFocus
						onInput={(e) => setAlt(e.target.value)}
						className='flex-1 text-2xl border-2 border-slate-300 rounded-lg p-4'
						placeholder='Введите новое описание карточки'
					/>
					<input
						type='file'
						accept='image/png, image/gif, image/jpeg, image/jpg'
						onChange={(e) => setImage(e.target.files[0])}
						className='w-1/4 p-4 bg-slate-700 text-white cursor-pointer rounded-lg'
					/>
					{setting === "alternate" && (
						<input
							type='file'
							accept='image/png, image/gif, image/jpeg, image/jpg'
							onChange={(e) => setAlternateImage(e.target.files[0])}
							className='w-1/5 p-4 bg-slate-700 text-white cursor-pointer rounded-lg'
						/>
					)}
					<button
						type='submit'
						onClick={updateCard}
						className='w-1/5 text-2xl bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-lg'
					>
						Сохранить
					</button>
				</div>

				<div className='flex text-2xl my-6 gap-x-4 select-none'>
					<input
						ref={checkbox}
						id='alternate'
						type='checkbox'
						onChange={(e) => handleSetting(e.target.value)}
						value='alternate'
						className='cursor-pointer'
					/>
					<label
						htmlFor='alternate'
						className='cursor-pointer'
					>
						Редактировать альтернативное изображение
					</label>
				</div>
			</form>
			<div className='grid grid-cols-4 gap-4 p-4 mb-6 border-2 border-slate-300 bg-slate-100 rounded-lg'>
				<img
					src={card?.image}
					alt={card?.alt}
					className='w-full h-[220px] object-contain border-2 border-slate-300 bg-white rounded-lg'
				/>
				{card?.alternateImage !== "" && (
					<img
						src={card?.alternateImage}
						alt={card?.alt}
						className='w-full h-[220px] object-contain border-2 border-slate-300 bg-white rounded-lg'
					/>
				)}
			</div>
		</div>
	);
}
