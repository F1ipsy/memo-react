import styles from "./Card.module.css";
import classNames from "classnames";

export default function Card({ isFlipped, back_img, onClick }) {
	return (
		<div
			className={styles.card}
			onClick={onClick}
		>
			<div
				className={classNames(
					isFlipped ? styles.hide_front : null,
					styles.front
				)}
			></div>
			<div
				className={classNames(
					isFlipped ? styles.show_back : null,
					styles.back
				)}
			>
				<img
					src={back_img}
					className='w-full h-full object-contain'
					alt='back_img'
				/>
			</div>
		</div>
	);
}
