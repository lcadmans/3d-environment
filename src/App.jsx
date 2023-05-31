import React, { useEffect, useMemo, useRef, useState, useCallback, useLayoutEffect, Suspense, useSyncExternalStore } from 'react'
import { shallow } from 'zustand/shallow'
import { Environment, PerspectiveCamera, Stars, useScroll, ScrollControls, Sphere, Scroll, Loader, useProgress, Text, CameraControls, Bounds, useBounds, OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, Scanline, Vignette, SSAO, SMAA } from '@react-three/postprocessing'
import { BlendFunction, KernelSize, Resizer } from 'postprocessing'
import { animated, a, update } from '@react-spring/three'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import useRefs from 'react-use-refs'
import { Lights, HirecoUniverse, ConsoleLogger, ScrollPages, FocusPanel, CustomLoader, ContentHolder } from './components'
import { appState } from './store'
import { resolveAfterSmoothTime, asyncCall } from './functions'
import { baseCameraPositions, cameraPositionsStore } from './data'
import * as THREE from 'three'
import { Euler, Vector3, BufferAttribute } from 'three'

function subscribeDimensions(callback) {
	window.addEventListener('resize', callback)
	return () => window.removeEventListener('resize', callback)
}

function getSnapshot() {
	return { width: window.innerWidth, height: window.innerHeight }
}

function App() {
	const setDimensions = appState(state => state.setDimensions)
	const orbitControlsRef = useRef()
	const cameraControlsRef = useRef()
	const cameraRef = useRef()

	const { progress } = useProgress()

	const [aspects, setAspects] = useState([0.15, 0.1])
	const [cameraFov, setCameraFov] = useState(75)

	const [smoothTime, setSmoothTime] = useState(0.3)

	const [cameraPositions, setCameraPositions] = useState(baseCameraPositions)
	const activeRing = appState(state => state.activeRing)

	const currentView = appState(state => state.currentView)

	const cameraControlsMouseButtons = appState(state => state.cameraControlsMouseButtons)
	const setActiveTile = appState(state => state.setActiveTile)
	const setCameraControlsref = appState(state => state.setCameraControlsref)

	const getUniverseStores = appState(state => state.getUniverseStores)
	const { sectionPositions } = getUniverseStores()

	useEffect(() => {
		// subscribeDimensions(setDimensions(getSnapshot()))
	}, [])

	// function updateDimensionsState() {
	// 	// console.log('updateDimensions')
	// 	setDimensions(getSnapshot())
	// 	// console.log(dimensions)
	// }
	// updateDimensionsState()

	let content = {
		page1:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		page2:
			'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam lobortis dolor nec sem auctor, nec pellentesque elit bibendum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus felis felis, convallis et commodo in, sagittis ac diam. Praesent sit amet risus feugiat, ornare lorem vel, ullamcorper est. Aenean in convallis purus, ac sollicitudin justo. Suspendisse non accumsan erat, vitae fringilla diam. Suspendisse sit amet risus eget nunc iaculis volutpat efficitur sit amet mauris.',
		page3:
			'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam lobortis dolor nec sem auctor, nec pellentesque elit bibendum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus felis felis, convallis et commodo in, sagittis ac diam. Praesent sit amet risus feugiat, ornare lorem vel, ullamcorper est. Aenean in convallis purus, ac sollicitudin justo. Suspendisse non accumsan erat, vitae fringilla diam. Suspendisse sit amet risus eget nunc iaculis volutpat efficitur sit amet mauris.'
	}

	// console.log(sectionPositions)

	// useEffect(() => {
	// 	setCameraControlsref(cameraControlsRef)
	// }, [cameraControlsRef])

	function updateCameraPosition(props) {
		const { cameraControlsRef, cameraPositionsStore, activeRing } = props

		if (!cameraControlsRef.current) return null

		if (activeRing == 'none') return null
		if (!cameraControlsRef.current) return null
		let [initialPositionX, initialPositionY, initialPositionZ] = [cameraControlsRef.current._camera.position.x, cameraControlsRef.current._camera.position.y, cameraControlsRef.current._camera.position.z]
		let { x: initialTargetX, y: initialTargetY, z: initialTargetZ } = cameraControlsRef.current?.getTarget()
		let [endPositionX, endPositionY, endPositionZ] = [cameraPositionsStore.focus[activeRing].position.x, cameraPositionsStore.focus[activeRing].position.y, cameraPositionsStore.focus[activeRing].position.z]

		if (currentView == 'page') {
			let { x: endTargetX, y: endTargetY, z: endTargetZ } = sectionPositions[activeRing]

			cameraControlsRef.current?.lerpLookAt(initialPositionX, initialPositionY, initialPositionZ, initialTargetX, initialTargetY, initialTargetZ, endPositionX, endPositionY, endPositionZ, endTargetX, endTargetY, endTargetZ, 1, true)
		} else {
			let [endTargetX, endTargetY, endTargetZ] = [cameraPositionsStore.focus[activeRing].target.x, cameraPositionsStore.focus[activeRing].target.y, cameraPositionsStore.focus[activeRing].target.z]
			cameraControlsRef.current?.lerpLookAt(initialPositionX, initialPositionY, initialPositionZ, initialTargetX, initialTargetY, initialTargetZ, endPositionX, endPositionY, endPositionZ, endTargetX, endTargetY, endTargetZ, 1, true)
		}
	}

	// useEffect(() => {
	// 	updateCameraPosition({ cameraControlsRef, cameraPositionsStore, activeRing })
	// }, [])

	useEffect(() => {
		if (!cameraControlsRef) return null
		console.log(cameraControlsRef)
	}, [cameraControlsRef])

	// useEffect(() => {
	// 	if (!cameraControlsRef) return null

	// 	if (currentView != 'page') {
	// 		setActiveTile(null)
	// 	}
	// 	if (currentView == 'page') {
	// 		updateCameraPosition({ cameraControlsRef, cameraPositionsStore, activeRing })
	// 	}
	// 	if (activeRing.includes('ring') && currentView == 'focus') {
	// 		updateCameraPosition({ cameraControlsRef, cameraPositionsStore, activeRing })
	// 	} else if (activeRing == 'none') {
	// 		returnToCameraOrigin({ cameraControlsRef, cameraPositions })
	// 	}
	// }, [activeRing, currentView])

	function getCameraInformation(e) {
		let cameraInformation = {}
		cameraInformation.position = cameraControlsRef.current._camera.position.clone()
		cameraInformation.target = cameraControlsRef.current._target.clone()
		console.log(cameraInformation)
	}

	// useEffect(() => {
	// 	if (!cameraRef) return
	// 	// console.log(cameraControlsRef)
	// 	console.log(cameraRef.current)
	// }, [])

	return (
		<>
			{/* <FocusPanel></FocusPanel> */}
			{/* <DragPanel></DragPanel> */}
			{/* {activeRing != 'none' ? <ContentOverlay /> : <></>} */}
			{/* <CustomLoader /> */}
			{/* <Loader /> */}
			<ConsoleLogger />

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
				<PerspectiveCamera
					ref={cameraRef}
					// manual={true}
					aspect={aspects[0] / aspects[1]}
					fov={cameraFov}
					// position={Object.values(cameraPositions[0].position)}
					// position={Object.values(cameraPositionsStore.focus[activeRing].position)}
					// position={[0, 0, 0]}
					// position={[0, 0.1, 0]}
					// near={0.01}
					// far={0.01}
					makeDefault
				/>
				{/* <CameraControls
					ref={cameraControlsRef}
					// enableZoom={true}
					// mouseButtons={cameraControlsMouseButtons}
					// onEnd={e => {
					// 	getCameraInformation(e)
					// }}
					// makedefault
					// smoothTime={smoothTime}
					camera={cameraRef.current}
				/> */}
				<OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} ref={orbitControlsRef} />
				{/* <Suspense fallback={null}> */}
				<Environment files='./environment/nedula.hdr' background={true} blur={0.1} rotation={5} />
				<Lights />
				<directionalLight position={[0, 0, 5]} color='red' />
				<color attach='background' args={['#191920']} opacity={1} />
				<fog attach='fog' args={['#000000', 1.2, 2.1]} />
				<hemisphereLight color='white' groundColor='#ff0f00' position={[-7, 25, 13]} intensity={1} />

				<Environment files='./environment/nedula_bright.hdr' blur={0.1}></Environment>
				<Bounds damping={3} margin={4}>
					<Scene></Scene>
				</Bounds>
				<EffectComposer>
					<Bloom
						intensity={2}
						luminanceThreshold={1}
						luminanceSmoothing={0.025}
						width={Resizer.AUTO_SIZE} // render width
						height={Resizer.AUTO_SIZE}
						kernelSize={KernelSize.LARGE}
						blurPass={undefined}
						mipmapBlur={false}
					/>
					<Vignette
						eskil={false}
						offset={0.5}
						darkness={0.7}
						// blendFunction={'add'}
					/>
					{/* <Noise opacity={0.075} /> */}
					{/* <Scanline
						blendFunction={BlendFunction.OVERLAY} // blend mode
						density={0.6} // scanline density
						opacity={0.025} // scanline opacity
					/> */}
					{/* <SSAO samples={25} intensity={20} luminanceInfluence={0.5} radius={0.2} scale={0.5} bias={0.5} /> */}
					{/* <SMAA edgeDetectionMode={EdgeDetectionMode.DEPTH} /> */}
				</EffectComposer>
				<Stars />
				{/* </Suspense> */}
			</Canvas>
		</>
	)
}

const _Scene = props => {
	return <></>
}

function Scene() {
	const [floatGroup, hirecoUniverseRef] = useRefs()
	const currentView = appState(state => state.currentView, shallow)
	const activeRing = appState(state => state.activeRing, shallow)
	const activeTile = appState(state => state.activeTile, shallow)
	const focusElementRef = appState(state => state.focusElementRef, shallow)
	const setFocusElementRef = appState(state => state.setFocusElementRef, shallow)
	const ringNames = appState(state => state.ringNames)
	// const updateBounds = appState(state => state.updateBounds)
	const setUpdateBounds = appState(state => state.setUpdateBounds)

	function updateboundsFunction(props) {
		const { position, target } = props
		const { xPos, yPos, zPos } = position
		const { xTar, yTar, zTar } = target
		// bounds.to({ position: [1, 2, 1], target: [0, 0, 0] })
		bounds.to({ position: [xPos, yPos, zPos], target: [xTar, yTar, zTar] })
	}

	setUpdateBounds(updateboundsFunction)

	useFrame(state => {
		const { camera } = state
		const t = state.clock.getElapsedTime()
		floatGroup.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 30)
	})

	const getUniverseStores = appState(state => state.getUniverseStores)
	const { sectionPositions } = getUniverseStores()

	// console.log(sectionPositions)

	const bounds = useBounds()

	const [initialLoad, setInitialLoad] = useState(false)

	useEffect(() => {
		// Handle initial load
		if (!initialLoad) {
			const { x, y, z } = cameraPositionsStore.focus['none'].position
			updateboundsFunction({ position: { xPos: x, yPos: y, zPos: z }, target: { xTar: 0, yTar: 0, zTar: 0 } })
			// bounds.to({ position: [x, y, z], target: [0, 0, 0] })
			setInitialLoad(true)
		}
		// bounds.refresh(focusElementRef.current)
		// bounds.fit()
		// bounds.clip()
		// if (currentView == 'page' && !activeTile) {
		// 	let [endPositionX, endPositionY, endPositionZ] = [cameraPositionsStore.focus[activeRing].position.x, cameraPositionsStore.focus[activeRing].position.y, cameraPositionsStore.focus[activeRing].position.z]
		// 	let { x: endTargetX, y: endTargetY, z: endTargetZ } = sectionPositions[activeRing]
		// 	// bounds.refresh()
		// 	// bounds.fit()
		// 	// bounds.clip()
		// 	bounds.to({ position: [endPositionX, endPositionY, endPositionZ], target: [endTargetX, endTargetY, endTargetZ] })
		// }
		// if (currentView == 'page' && activeTile) {
		// 	// bounds.to({ position: [0, 0, 0], target: [0, 0, 0] })
		// }
	}, [])

	useEffect(() => {
		if (currentView == 'page') {
			let [endPositionX, endPositionY, endPositionZ] = [cameraPositionsStore.focus[activeRing].position.x, cameraPositionsStore.focus[activeRing].position.y, cameraPositionsStore.focus[activeRing].position.z]
			let { x: endTargetX, y: endTargetY, z: endTargetZ } = sectionPositions[activeRing]

			bounds.to({ position: [endPositionX, endPositionY, endPositionZ], target: [endTargetX, endTargetY, endTargetZ] })
		}
	}, [currentView])

	useEffect(() => {
		if (!focusElementRef) return
		bounds.refresh(focusElementRef.current)
		bounds.fit()
		bounds.clip()
	}, [focusElementRef])

	return (
		<group ref={floatGroup}>
			<ContentHolder visible={currentView == 'page'} sectionName={ringNames[activeRing]} />
			<group ref={hirecoUniverseRef}>
				<HirecoUniverse />
			</group>
		</group>
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
		<div className={`wrap absolute z-40 h-screen  items-center pl-10 pr-10 grad-left flex  w-1/3 `}>
			<div className='content text-white '>
				<div
					className='back pb-6 pointer-events-auto cursor-pointer'
					onClick={() => {
						setActiveRing('none')
						setCurrentView('main')
						setActiveTile(null)
						let [endPositionX, endPositionY, endPositionZ] = [cameraPositionsStore.focus['none'].position.x, cameraPositionsStore.focus['none'].position.y, cameraPositionsStore.focus['none'].position.z]
						updateBounds({ position: { xPos: endPositionX, yPos: endPositionY, zPos: endPositionZ }, target: { xTar: 0, yTar: 0, zTar: 0 } })
						// setScrollControlsInitiated(false)
					}}
				>
					<span className='uppercase font-bold tracking-wider'>Back</span>
				</div>
				{currentView == 'page' ? (
					<>
						<div className=''>
							<GenerateContent />
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	)
}

function GenerateContent(props) {
	const activeTile = appState(state => state.activeTile, shallow)
	const sectionContent = appState(state => state.sectionContent)
	const sectionCopy = appState(state => state.sectionCopy)
	const getContentByTitle = appState(state => state.getContentByTitle)
	const activeRing = appState(state => state.activeRing, shallow)
	const ringNames = appState(state => state.ringNames)

	const ringName = ringNames[activeRing]
	const currentContent = sectionContent(ringName)
	const currentSectionCopy = sectionCopy(ringName)

	const [activeTileContent, setActiveTileContent] = useState(null)

	const { subTitle: categorySubTitile, description: categoryDescription } = currentSectionCopy

	let title, subTitle, description, cta

	useEffect(() => {
		if (!activeTile) return setActiveTileContent(null)
		const content = getContentByTitle(activeTile)
		setActiveTileContent(...content)
	}, [activeTile])

	if (activeTileContent) {
		title = activeTile
		subTitle = activeTileContent.Subtitle
		description = activeTileContent.Description
	} else {
		title = ringName
		subTitle = categorySubTitile
		description = categoryDescription
		cta = 'Read More'
	}
	return (
		<>
			<h1 className={'text-7xl text-[#d19a41] font-[600]'}>{title}</h1>
			<h2 className={'text-3xl'}>{subTitle}</h2>
			<p className={'text-sm'}>{description}</p>
		</>
	)
}
