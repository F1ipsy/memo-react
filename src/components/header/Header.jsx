export default function Header({title}) {
	return (
		<div className='w-full flex text-white bg-slate-600 px-4 py-6 rounded-b-xl'>
			<h2 className='text-3xl font-bold'>{title}</h2>
		</div>
	);
}
