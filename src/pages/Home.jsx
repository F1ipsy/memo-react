import Card from "../components/card/Card";
import CategoriesMenu from "../components/categoriesMenu/CategoriesMenu";
import { useState, useRef, useEffect } from "react";
import Header from "../components/header/Header";

export default function App() {
	const [category, setCategory] = useState(null);
	const [selectedCards, setSelectedCards] = useState([]);
	const [matchedCards, setMatchedCards] = useState([]);
	const [cards, setCards] = useState([]);
	const [gridCols, setGridCols] = useState("grid-cols-1");
	const [showCongratsMessage, setShowCongratsMessage] = useState(false);
	const [showInstruction, setShowInstruction] = useState(true);
	const [numberOfMoves, setNumberOfMoves] = useState(0);
	const timerRef = useRef(null);

	const getCards = async () => {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/cards?categoryId=${category?.id}`);

		if (response.ok) {
			const result = await response.json();

			switch (result.length) {
				case 3:
					setGridCols("grid-cols-3");
					break;
				case 5:
					setGridCols("grid-cols-5");
					break;
				case 9:
					setGridCols("grid-cols-6");
					break;
				case 10:
					setGridCols("grid-cols-5");
					break;
				case 11:
					setGridCols("grid-cols-6");
					break;
				case 12:
					setGridCols("grid-cols-6");
					break;
				default:
					setGridCols("grid-cols-4");
					break;
			}

			setCards(result);

			result.map((card) =>
				setCards((prev) => [
					...prev,
					{
						id: prev.length + Date.now(),
						image:
							card.alternateImage !== "" ? card.alternateImage : card.image,
						alt: card.alt,
					},
				])
			);

			setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
			console.log(cards)
		}
	};

	const handleCategory = (category) => {
		setCategory(category);
	};

	const selectCard = (card) => {
		if (
			!selectedCards.some((elem) => elem.id === card.id) &&
			selectedCards.length < 2
		) {
			setSelectedCards([...selectedCards, card]);
		}
	};

	const navigateToMenu = () => {
		setCategory(null);
		setCards([]);
		setSelectedCards([]);
		setMatchedCards([]);
		clearTimeout(timerRef.current);
		setShowCongratsMessage(false);
		setShowInstruction(true);
		setNumberOfMoves(0);
	};

	useEffect(() => {
		if (!category) return;
		getCards();
	}, [category]);

	useEffect(() => {
		if (selectedCards.length === 2) {
			const [firstCard, secondCard] = selectedCards;

			if (firstCard.alt === secondCard.alt) {
				setMatchedCards([...matchedCards, firstCard.id, secondCard.id]);
				setSelectedCards([]);
			} else {
				setTimeout(() => {
					setSelectedCards([]);
				}, 1000);
			}

			setNumberOfMoves(numberOfMoves + 1);
		}
	}, [selectedCards]);

	useEffect(() => {
		if (cards.length > 0 && matchedCards.length === cards.length) {
			timerRef.current = setTimeout(() => {
				setGridCols("grid-cols-1");
				setShowCongratsMessage(true);
			}, 2000);
		}
	}, [matchedCards]);

	const link = document.referrer;

	return !category ? (
		<CategoriesMenu onClick={handleCategory} />
	) : (
		<div className='w-full h-screen flex flex-col mx-auto px-12'>
			<div className='flex gap-4'>
				{(link === "" || link === "http://memo.sfera.local/") &&
					<button
						onClick={navigateToMenu}
						className='w-1/6 bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 text-3xl rounded-b-xl p-4'
					>
						В меню
					</button>
				}
				<Header title={`Категория "${category.title}"`}/>
			</div>

			<div className='h-full flex justify-center my-6'>
				{showInstruction ? (
					<div className='flex flex-col w-1/2 my-auto'>
						<div className='bg-slate-400 p-4 rounded-xl'>
							<h2 className='text-white text-2xl text-center font-bold'>
								Инструкция
							</h2>
							<hr className='h-[2px] bg-white my-4' />
							<p className='text-white text-2xl whitespace-pre-line text-center'>
								{category.instruction}
							</p>
						</div>
						<button
							onClick={() => setShowInstruction(false)}
							className='bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 text-2xl rounded-xl mt-4 p-4'
						>
							Начать
						</button>
					</div>
				) : !showCongratsMessage && cards.length === 0 ? (
					<div className='bg-slate-400 p-4 rounded-xl my-auto'>
						<h2 className='text-2xl text-white'>Карточек нет ¯\_(ツ)_/¯</h2>
					</div>
				) : !showCongratsMessage && cards.length > 0 ? (
					<div
						className={`w-full bg-slate-400/50 backdrop-blur-sm grid ${gridCols} p-4 gap-4 rounded-xl`}
					>
						{cards.map((el) => (
							<Card
								onClick={() => selectCard(el)}
								isFlipped={
									selectedCards.some((card) => card.id === el.id) ||
									matchedCards.includes(el.id)
								}
								back_img={`${import.meta.env.VITE_API_URL}/storage/${el.image}`}
								key={el.id}
							/>
						))}
					</div>
				) : showCongratsMessage ? (
					<div className='bg-slate-400 text-center p-4 rounded-xl my-auto'>
						<h2 className='text-2xl text-white '>
							Поздравляем, Вы собрали все пары карточек! <br />
						</h2>
						<hr className='h-[2px] bg-white my-4' />
						<h2 className='text-2xl text-white'>
							Количество ходов: {numberOfMoves}
						</h2>
						<img
							className='absolute bottom-0 left-0'
							src='../src/assets/salut.gif'
							alt='salut'
						/>
						<img
							className='absolute bottom-0 right-0 -scale-x-100'
							src='../src/assets/salut.gif'
							alt='salut'
						/>
					</div>
				) : null}
			</div>
		</div>
	);
}
