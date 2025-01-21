import { Link, useParams } from "react-router-dom";
import Header from "../components/header/Header";
import { useEffect, useState, useRef } from "react";
import styles from "../pages/Cards.module.css";

export default function Cards() {
	const categoryId = useParams().id;
	const cardImage = useRef(null);
	const alternateCardImage = useRef(null);
	const checkbox = useRef(null);
	const [categoryTitle, setCategoryTitle] = useState("");
	const [alt, setAlt] = useState("");
	const [image, setImage] = useState("");
	const [alternateImage, setAlternateImage] = useState("");
	const [cards, setCards] = useState([]);
	const [setting, setSetting] = useState("");

	const handleSetting = (checkboxValue) => {
		if (setting === "alternate") {
			setSetting("");
		} else {
			setSetting(checkboxValue);
		}
	};

	const getCategory = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/categories/${categoryId}`
		);
		if (response.ok) {
			const result = await response.json();
			setCategoryTitle(result.title);
		}
	};

	const getCards = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/cards?categoryId=${categoryId}`
		);

		if (response.ok) {
			const result = await response.json();
			setCards(result);
		}
	};

	const createCard = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("alt", alt);
		formData.append("image", image);
		formData.append("alternateImage", alternateImage);
		formData.append("categoryId", categoryId);
		formData.append("setting", setting);

		const response = await fetch(`${import.meta.env.VITE_API_URL}/cards`, {
			method: "POST",
			body: formData,
		});

		const result = await response.json();

		if (response.ok) {
			getCards();
			cardImage.current.value = null;
			if (setting === "alternate") {
				alternateCardImage.current.value = null;
			}
			checkbox.current.checked = false;
			setSetting("");
			setAlt("");
			setImage("");
			setAlternateImage("");
		} else {
			alert(result.message);
		}
	};

	const deleteCard = async (id) => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/cards/${id}`,
			{
				method: "DELETE",
			}
		);
		if (response.ok) {
			getCards();
		}
	};

	useEffect(() => {
		getCategory();
		getCards();
	}, []);

	return (
		<div className='w-2/3 mx-auto'>
			<Header title={`Карточки категории "${categoryTitle}"`} />
			<form onSubmit={createCard}>
				<div className='w-full flex my-6 gap-x-4'>
					<input
						type='text'
						value={alt}
						onInput={(e) => setAlt(e.target.value)}
						className='flex-1 text-2xl border-2 border-slate-300 rounded-lg p-4'
						placeholder='Введите описание карточки'
					/>
					<input
						ref={cardImage}
						type='file'
						accept='image/png, image/gif, image/jpeg, image/jpg'
						onChange={(e) => setImage(e.target.files[0])}
						className='w-1/5 p-4 bg-slate-700 text-white cursor-pointer rounded-lg'
					/>
					{setting === "alternate" && (
						<input
							ref={alternateCardImage}
							type='file'
							accept='image/png, image/gif, image/jpeg, image/jpg'
							onChange={(e) => setAlternateImage(e.target.files[0])}
							className='w-1/5 p-4 bg-slate-700 text-white cursor-pointer rounded-lg'
						/>
					)}
					<button
						type='submit'
						className='w-1/5 text-2xl bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-lg'
					>
						Создать
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
						Добавить альтернативное изображение
					</label>
				</div>
			</form>
			<div className='grid grid-cols-4 gap-4 p-4 mb-6 border-2 border-slate-300 bg-slate-100 rounded-lg'>
				{cards.length === 0 ? (
					<h2 className='text-2xl'>Карточек нет ¯\_(ツ)_/¯</h2>
				) : (
					cards.map((card) => (
						<div
							className={styles.card_container}
							key={card.id}
						>
							<div className={styles.backdrop_blur}>
								<div className={styles.cmd_buttons}>
									<button
										onClick={() => deleteCard(card.id)}
										className='cursor-pointer p-4 bg-red-500 hover:bg-gradient-to-t from-red-500 to-red-400 border border-white text-white rounded-md'
									>
										Удалить
									</button>
									<Link
										to={`${import.meta.env.VITE_APP_URL}/cards/edit/${card.id}`}
										className='cursor-pointer p-4 bg-blue-500 hover:bg-gradient-to-t from-blue-500 to-blue-400 border border-white text-white rounded-md'
									>
										Редактировать
									</Link>
								</div>
							</div>

							<img
								src={`${import.meta.env.VITE_API_URL}/storage/${card.image}`}
								alt={card.alt}
								className='w-full h-[220px] object-contain'
							/>
						</div>
					))
				)}
			</div>
		</div>
	);
}
