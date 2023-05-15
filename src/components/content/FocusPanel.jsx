import { appState } from '../../store/store'

export const FocusPanel = position => {
	const activeSlide = appState(state => state.activeSlide)
	const selectSlide = appState(state => state.setActiveSlide)
	function handleOpacity() {
		if (activeSlide === 0) {
			return 'hidden pointer-events-none'
		} else {
			return 'opacity-100'
		}
	}
	function handleSide(side) {
		if (side == 'left') {
			return ''
		} else {
			return 'flex justify-end'
		}
	}

	let side = 'left'
	if (activeSlide == 4 || activeSlide == 2 || activeSlide == 1) side = 'right'

	let titleText = { 5: { title: 'WELFARE', subTitle: 'ENVIRONMENT + PARK' }, 4: { title: 'TECHNOLOGY', subTitle: 'SMART + ASSET' }, 3: { title: 'SUPPORT', subTitle: 'MAINTAIN + FINANCE' }, 2: { title: 'SOURCE', subTitle: 'ASSETS + FINANCE' }, 1: { title: 'EXPERTS', subTitle: 'THE TEAM' } }
	let activeIndex = activeSlide

	let title = ''
	let subTitle = ''

	if (activeSlide) title = titleText[activeIndex].title
	if (activeSlide) subTitle = titleText[activeIndex].subTitle

	return (
		<div
			className={`wrap absolute z-40 h-screen  items-center pl-10 pr-10 
    ${side == 'left' ? 'grad-left' : 'grad-right'}
      flex 
     ${handleOpacity()}
    `}
		>
			<div className={`relative ${handleSide(side)}`}>
				<div className='content text-white w-2/5'>
					<div
						className='back flex items-center pb-6 cursor-pointer'
						onClick={() => {
							if (activeSlide != 0) selectSlide(0)
						}}
					>
						{/* <ArrowSvg /> */}
						<span className='pl-2 uppercase font-bold tracking-wider'>Back</span>
					</div>
					<h2 className='text-[90px] font-extrabold'>{title}</h2>
					<h2 className='text-4xl pt-0'>{subTitle}</h2>
					<p className='w-full text-base font-light'>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
						velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
					<div
						className='read-more flex items-center pb-6 cursor-pointer pt-20'
						onClick={() => {
							if (activeSlide != 0) selectSlide(0)
						}}
					>
						<span className='pl-2 uppercase font-bold tracking-wider pr-2 text-[#d19a41]'>Read More</span>
						{/* <ArrowSvg direction={'forward'} fill={'#d19a41'} /> */}
					</div>
				</div>
			</div>
		</div>
	)
}
