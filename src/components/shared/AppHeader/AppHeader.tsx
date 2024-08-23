import NextImage from 'next/image';

export interface AppHeaderProps {
	appName: string;
	appLogo: string;
}

export function AppHeader(props: AppHeaderProps) {
	return (
		<div className="w-full fixed top-0 flex justify-between items-center p-2 bg-gray-950 text-gray-200">
			<div className='md:container md:mx-auto flex items-center justify-between'>
				<div className="flex items-center">
					<NextImage src={props.appLogo} alt="logo" className="w-8 h-8" width={40} height={40} />
					<span className="text-xl font-bold ml-2">{props.appName}</span>
				</div>
			</div>
		</div>
	);
}
