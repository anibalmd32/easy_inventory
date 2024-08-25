export function PageContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<div className='w-full text-slate-300 overflow-auto pt-[1rem] md:pt-[2rem]'>
			<div className='w-full md:container px-2'>{children}</div>
		</div>
	)
}
