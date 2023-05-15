import { useProgress } from '@react-three/drei'
import { appState } from '../../store'
import { useState } from 'react'

export function CustomLoader() {
	const { progress } = useProgress()

	const started = appState(state => state.started, shallow)
	const setStarted = appState(state => state.setStarted)
	// const [started, setStarted] = useState(false)
	const [unmount, setUnmount] = useState(false)

	useEffect(() => {
		console.log('started')
		console.log(started)
		setUnmount(true)
		if (started == true) {
			setTimeout(() => {
				console.log('unmount')
			}, 2500)
		}
	}, [started])

	return (
		<>
			{unmount ? (
				<></>
			) : (
				<>
					<>
						<div className={`absolute z-50 w-full h-full flex items-center justify-center custom-loader bg-slate-900 transition-all ease-in-out delay-[1400ms] duration-[1200ms] ${!started ? 'opacity-100' : 'opacity-0 '}`}></div>
						<div className={`absolute z-50 w-full  flex items-center justify-center custom-loader bg-amber-600 transition-all ease-in-out delay-[200ms] duration-[800ms] ${!started ? 'h-full' : 'h-0 '}`}>
							<p className={`text-slate-100 cursor-pointer ${progress == 100 ? 'opacity-70' : 'opacity-20'} ${!started ? '' : 'opacity-0 '}  hover:opacity-80 hover:text-lg transition-all font-light`} onClick={() => setStarted(true)}>
								Explore
							</p>
						</div>
					</>
				</>
			)}
		</>
	)
}
