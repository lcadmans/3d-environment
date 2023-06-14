import { Bounds, Effects, Environment, Loader, OrbitControls, PerspectiveCamera, Stars, useProgress } from '@react-three/drei'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { UnrealBloomPass, VignetteShader } from 'three-stdlib'
import { shallow } from 'zustand/shallow'
import { Scene } from './Scene'
import { ConsoleLogger } from './components'
import { appState } from './store'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

extend({ UnrealBloomPass, VignetteShader })

function processData(data) {
	let arr = []

	data.items.forEach(a => {
		console.log(a)
		let row = {}
		const { fields, metadata, sys } = a
		// console.log(fields)
		let { title, subtitle, description, image, otherImages } = fields
		let section, ring
		section = sys.contentType.sys.id

		// console.log(section)
		if (section == 'sectionCopy') ring = fields.section

		let { id } = sys
		description = description.content[0]
		if (description.content[0].value) description = description.content[0].value
		else description = ''

		// console.log(description)
		// console.log(section)

		// if (section == 'source') {
		// 	console.log(image)
		// }

		row['title'] = title
		row['subtitle'] = subtitle
		row['description'] = description
		row['image'] = image
		row['section'] = toTitleCase(section)
		row['otherImages'] = otherImages
		row['ring'] = ring
		row['id'] = id

		arr.push(row)
	})
	return arr
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	})
}

function App() {
	const activeRing = appState(state => state.activeRing)
	const fetchData = appState(state => state.fetchData, shallow)
	const activeTile = appState(state => state.activeTile)
	const getUniverseStores = appState(state => state.getUniverseStores)
	const setFetchData = appState(state => state.setFetchData)
	// const fetchData = appState(state => state.fetchData)

	const { sectionPositions } = getUniverseStores()

	const masterGroup = useRef()
	const cameraRef = useRef()
	const orbitControlsRef = useRef()
	const cameraControlsRef = useRef()

	const [intensity, setIntensity] = useState(0.5)
	const [radius, setRadius] = useState(1)

	const { progress } = useProgress()

	// const { intensity, radius, boundsMargin } = useControls({
	// intensity: { value: 0.69, min: 0, max: 1.5, step: 0.01 },
	// radius: { value: 1, min: 0, max: 1, step: 0.01 }
	// cameraFov: { value: 35, min: 0, max: 200, step: 0.01 }
	// boundsMargin: { value: 5, min: 0, max: 100, step: 0.01 }
	// })

	const { isLoading, error, data } = useQuery({
		queryKey: ['repoData'],
		queryFn: () => fetch('https://cdn.contentful.com/spaces/ndcfmypd0yep/environments/master/entries?access_token=YZXIc9fW0cmy7ymmmZGQ6k8W2vO76zG3XIvsoccZLE8').then(res => res.json())
	})

	useEffect(() => {
		if (!data) return
		setFetchData(processData(data))
	}, [data])

	useEffect(() => {
		if (!orbitControlsRef || !orbitControlsRef.current) return
		if (activeTile) orbitControlsRef.current.enableZoom = false
		else orbitControlsRef.current.enableZoom = true
	}, [activeTile])

	function getCameraInformation(e) {
		let cameraInformation = {}
		cameraInformation.position = cameraRef.current.position.clone()
		cameraInformation.target = orbitControlsRef.current.target.clone()
		console.log(cameraInformation)
	}

	return (
		<>
			{activeRing != 'none' ? <ContentOverlay /> : <></>}
			{/* <CustomLoader /> */}
			<Loader />
			<ConsoleLogger />

			{fetchData && (
				<Canvas
					// onCreated={state => {
					// state.setEvents({ filter: intersections => intersections.filter(i => i.object.visible) })
					// }}
					className='relative'
					style={{ height: '100vh' }}
					// shadows
					// gl={{ alpha: false }}
					// camera={{ position: [0, 0.5, 0], fov: 50 }}
					// dpr={[1, 2]}
					// onCreated={() => {
					// 	setActiveRing('none')
					// }}
				>
					<Environment files='./environment/nedula_bright.hdr' blur={0.1}></Environment>
					<group ref={masterGroup}>
						<ambientLight intensity={2} />
						<PerspectiveCamera
							ref={cameraRef}
							// manual={false}
							// aspect={aspects[0] / aspects[1]}
							aspect={window.innerWidth / window.innerHeight}
							fov={60}
							// position={Object.values(cameraPositions[0].position)}
							// position={Object.values(cameraPositionsStore.focus[activeRing].position)}
							// position={[0, 0, 0]}
							position={[-75, 105, 324]}
							// near={6000}
							// far={600/}
							makeDefault
						/>
						<OrbitControls
							// camera={cameraRef.current}
							makeDefault
							minPolarAngle={0.5}
							maxPolarAngle={Math.PI / 2.3}
							minDistance={5}
							maxDistance={300}
							ref={orbitControlsRef}
							// onChange={e => getCameraInformation(e)}
							// onStart={() => console.log('start')}
							onEnd={e => getCameraInformation(e)}
						/>
						<Suspense fallback={null}>
							<Environment files='./environment/nedula.hdr' background={true} blur={0.05} rotation={5} />

							<color attach='background' args={['#191920']} opacity={1} />
							<fog attach='fog' args={['#000000', 200, 1500]} />
							<hemisphereLight color='white' groundColor='#ff0f00' position={[-7, 25, 13]} intensity={1} />

							<Bounds damping={3} margin={3}>
								<Scene cameraRef={cameraRef} orbitControlsRef={orbitControlsRef}></Scene>
							</Bounds>
							<Effects disableGamma>
								{/* threshhold has to be 1, so nothing at all gets bloom by default */}
								<unrealBloomPass threshold={1} strength={intensity} radius={radius} />
								{/* <vignetteShader /> */}
								{/* <Vignette eskil={false} offset={0.5} darkness={1} blendFunction={'add'} /> */}
							</Effects>
							<Stars
								radius={500}
								depth={500}
								count={5000}
								// factor={4}
								saturation={1}
								// fade
								speed={5}
							/>
						</Suspense>
					</group>
				</Canvas>
			)}
		</>
	)
}

export default App

function ContentOverlay(props) {
	const { returnCameraToOrigin } = props

	const setActiveRing = appState(state => state.setActiveRing)
	const setCurrentView = appState(state => state.setCurrentView)
	const setActiveTile = appState(state => state.setActiveTile)
	const activeRing = appState(state => state.activeRing, shallow)
	const ringNames = appState(state => state.ringNames)
	const currentView = appState(state => state.currentView, shallow)
	const updateBounds = appState(state => state.updateBounds, shallow)

	return (
		<div className={`wrap absolute z-40 h-screen  items-center pl-10 grad-left flex w-1/2 pr-[30%] pointer-events-none `}>
			<div className='content text-white h-full flex flex-col justify-around'>
				<div
					className='back pb-6 pointer-events-auto cursor-pointer pt-6'
					onClick={() => {
						setActiveRing('none')
						setCurrentView('main')
						setActiveTile(null)
						let [endPositionX, endPositionY, endPositionZ] = [-75, 105, 324]
						updateBounds({ position: { xPos: endPositionX, yPos: endPositionY, zPos: endPositionZ }, target: { xTar: 0, yTar: 0, zTar: 0 } })
					}}
				>
					<span className='uppercase font-bold tracking-wider'>Back</span>
				</div>
				{currentView == 'page' ? (
					<>
						<div className='testimonial text-xl'>
							<p class={'text-orange-500'}>"Gendae nam fugit, u opta cus es eum alibusdae peditiur re laut fuga. Em fugiam GXO, Head of Fleet UK"</p>
						</div>
						<div className='ask-me-more text-xl pt-12'>
							<p class={'uppercase font-bold text-orange-500'}>Want to know more about</p>
							<p class={'uppercase font-bold '}> {`> Sourcing`}</p>
							<p class={'uppercase font-bold '}> {`> Finance`}</p>
							<p class={'uppercase font-bold '}> {`> Fleet Maintenance`}</p>
							<p class={'uppercase font-bold '}> {`> Smart Tech`}</p>
							<p class={'uppercase font-bold '}> {`> Truck Park`}</p>
							<p class={'uppercase font-bold '}> {`> Green Creds`}</p>
						</div>
						<div className=''></div>
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	)
}

function subscribeDimensions(callback) {
	window.addEventListener('resize', callback)
	return () => window.removeEventListener('resize', callback)
}

function getSnapshot() {
	return { width: window.innerWidth, height: window.innerHeight }
}
