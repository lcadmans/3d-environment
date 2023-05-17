import React, { useEffect, useMemo, useRef, useState, useCallback, useLayoutEffect, Suspense, useSyncExternalStore } from 'react'
import { shallow } from 'zustand/shallow'
import { Environment, PerspectiveCamera, Stars, useScroll, ScrollControls, Sphere, Scroll, Loader, useProgress, Text, CameraControls } from '@react-three/drei'
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
	const activeRing = appState(state => state.activeRing, shallow)
	const setActiveRing = appState(state => state.setActiveRing)
	const setIsAnimating = appState(state => state.setIsAnimating)
	const numPages = appState(state => state.numPages)
	const currentView = appState(state => state.currentView)
	const setCurrentView = appState(state => state.setCurrentView)
	const returnCameraToOrigin = appState(state => state.returnCameraToOrigin)

	const activePage = appState(state => state.activePage)
	const setDimensions = appState(state => state.setDimensions)
	const scrollControlsInitiated = appState(state => state.scrollControlsInitiated, shallow)
	const setScrollControlsInitiated = appState(state => state.setScrollControlsInitiated)

	useEffect(() => {
		subscribeDimensions(setDimensions(getSnapshot()))
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
	return (
		<>
			{/* <FocusPanel></FocusPanel> */}
			{/* <DragPanel></DragPanel> */}
			{activeRing != 'none' ? <ContentOverlay returnCameraToOrigin={returnCameraToOrigin} /> : <></>}
			{/* <CustomLoader /> */}
			<Loader />
			<ConsoleLogger />
			<Suspense>
				<Canvas
					onCreated={state => {
						// state.setEvents({ filter: intersections => intersections.filter(i => i.object.visible) })
					}}
					className='relative'
					style={{ height: '100vh' }}
					shadows
					gl={{ alpha: false }}
					// onCreated={() => {
					// 	setActiveRing('none')
					// }}
				>
					<Environment files='./environment/nedula.hdr' background={true} blur={0.1} rotation={5} />
					{/* <ambientLight intensity={0.1} /> */}
					<Lights />
					<directionalLight position={[0, 0, 5]} color='red' />
					<color attach='background' args={['#191920']} opacity={1} />
					{/* <fog attach='fog' args={['#000000', 0.6, 1.8]} /> */}
					<fog attach='fog' args={['#000000', 1.2, 2.1]} />
					<_Scene></_Scene>
				</Canvas>
			</Suspense>
		</>
	)
}

const _Scene = props => {
	const cameraControlsRef = useRef()
	const cameraRef = useRef()

	const { progress } = useProgress()

	const [aspects, setAspects] = useState([0.15, 0.1])
	const [cameraFov, setCameraFov] = useState(75)
	const [scrollControlsActive, setScrollControlsActive] = useState(false)

	const [smoothTime, setSmoothTime] = useState(0.3)

	const scroll = useScroll()

	const [cameraPositions, setCameraPositions] = useState(baseCameraPositions)
	const activeRing = appState(state => state.activeRing)
	const numPages = appState(state => state.numPages)
	const isAnimating = appState(state => state.isAnimating)
	const setIsAnimating = appState(state => state.setIsAnimating)
	const currentView = appState(state => state.currentView)

	const cameraRefInfo = appState(state => state.cameraRefInfo)
	const setCameraRefInfo = appState(state => state.setCameraRefInfo)
	const activeCameraAnchor = appState(state => state.activeCameraAnchor)
	const setActiveCameraAnchor = appState(state => state.setActiveCameraAnchor)
	const generateCirclePoints = appState(state => state.generateCirclePoints)
	const cameraOrbitPoints = appState(state => state.cameraOrbitPoints)
	const cameraControlsMouseButtons = appState(state => state.cameraControlsMouseButtons)
	const forcePageUpdate = appState(state => state.forcePageUpdate)
	const setForcePageUpdate = appState(state => state.setForcePageUpdate)
	const dimensions = appState(state => state.dimensions, shallow)
	const scrollControlsInitiated = appState(state => state.scrollControlsInitiated, shallow)
	const setScrollControlsInitiated = appState(state => state.setScrollControlsInitiated)
	const setReturnCameraToOrigin = appState(state => state.setReturnCameraToOrigin)

	const getUniverseStores = appState(state => state.getUniverseStores)
	const { sectionPositions } = getUniverseStores()
	console.log(sectionPositions)

	function updateCameraPosition(props) {
		const { cameraControlsRef, cameraPositionsStore, activeRing } = props
		if (activeRing == 'none') return null
		if (!cameraControlsRef.current) return null
		let [initialPositionX, initialPositionY, initialPositionZ] = [cameraControlsRef.current._camera.position.x, cameraControlsRef.current._camera.position.y, cameraControlsRef.current._camera.position.z]
		let { x: initialTargetX, y: initialTargetY, z: initialTargetZ } = cameraControlsRef.current?.getTarget()
		let [endPositionX, endPositionY, endPositionZ] = [cameraPositionsStore.focus[activeRing].position.x, cameraPositionsStore.focus[activeRing].position.y, cameraPositionsStore.focus[activeRing].position.z]

		if (currentView == 'page') {
			;('pageTarget')
			let { x: endTargetX, y: endTargetY, z: endTargetZ } = sectionPositions[activeRing]
			console.log(endTargetX)
			cameraControlsRef.current?.lerpLookAt(initialPositionX, initialPositionY, initialPositionZ, initialTargetX, initialTargetY, initialTargetZ, endPositionX, endPositionY, endPositionZ, endTargetX, endTargetY, endTargetZ, 0.9, true)
		} else {
			let [endTargetX, endTargetY, endTargetZ] = [cameraPositionsStore.focus[activeRing].target.x, cameraPositionsStore.focus[activeRing].target.y, cameraPositionsStore.focus[activeRing].target.z]
			cameraControlsRef.current?.lerpLookAt(initialPositionX, initialPositionY, initialPositionZ, initialTargetX, initialTargetY, initialTargetZ, endPositionX, endPositionY, endPositionZ, endTargetX, endTargetY, endTargetZ, 0.9, true)
		}
	}

	// useEffect(() => {
	// 	updateCameraPosition({ cameraControlsRef, cameraPositionsStore, activeRing })
	// }, [])

	const returnToCameraOrigin = props => {
		const { cameraControlsRef, cameraPositions } = props
		let [initialPositionX, initialPositionY, initialPositionZ] = [cameraControlsRef.current._camera.position.x, cameraControlsRef.current._camera.position.y, cameraControlsRef.current._camera.position.z]
		let { x: initialTargetX, y: initialTargetY, z: initialTargetZ } = cameraControlsRef.current?.getTarget()
		let [endPositionX, endPositionY, endPositionZ] = [cameraPositions[0].position.x, cameraPositions[0].position.y, cameraPositions[0].position.z]
		let [endTargetX, endTargetY, endTargetZ] = [cameraPositions[0].target.x, cameraPositions[0].target.y, cameraPositions[0].target.z]

		cameraControlsRef.current?.lerpLookAt(initialPositionX, initialPositionY, initialPositionZ, initialTargetX, initialTargetY, initialTargetZ, endPositionX, endPositionY, endPositionZ, endTargetX, endTargetY, endTargetZ, 1, true)
	}

	useEffect(() => {
		if (!cameraControlsRef) return null

		if (currentView == 'page') {
		}
		if ((activeRing.includes('ring') && currentView == 'focus') || currentView == 'page') {
			updateCameraPosition({ cameraControlsRef, cameraPositionsStore, activeRing })
		} else if (activeRing == 'none') {
			returnToCameraOrigin({ cameraControlsRef, cameraPositions })
		}
	}, [activeRing, currentView])

	// useEffect(() => {
	// 	console.log('defaultCamera')
	// 	updateCameraPosition({ cameraControlsRef, cameraPositionsStore, activeRing })
	// }, [cameraControlsRef])

	useFrame(state => {
		const { camera } = state
		// if (currentView == 'page') cameraControlsRef.current?.setTarget()
		// const delta = scroll.delta
	})

	function getCameraInformation(e) {
		let cameraInformation = {}
		cameraInformation.position = cameraControlsRef.current._camera.position.clone()
		cameraInformation.target = cameraControlsRef.current._target.clone()
		console.log(cameraInformation)
	}

	return (
		<>
			<>
				{/* {cameraOrbitPoints &&
					cameraOrbitPoints.map(a => {
						return (
							<>
								<Sphere args={[0.02, 10, 10]} position={a}>
									<meshNormalMaterial />
								</Sphere>
							</>
						)
					})} */}
				<CameraControls
					ref={cameraControlsRef}
					enableZoom={false}
					mouseButtons={cameraControlsMouseButtons}
					// onEnd={e => {
					// 	getCameraInformation(e)
					// }}
					makedefault
					smoothTime={smoothTime}
					camera={cameraRef.current}
				/>
				<PerspectiveCamera
					ref={cameraRef}
					makeDefault
					manual
					aspect={aspects[0] / aspects[1]}
					fov={cameraFov}
					// position={Object.values(cameraPositions[0].position)}
					position={Object.values(cameraPositionsStore.focus[activeRing].position)}
					// position={[0, 0, 0.1]}
					near={0.01}
				/>
				<Environment files='./environment/nedula_bright.hdr' blur={0.1}></Environment>
				<Scene></Scene>
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
			</>
		</>
	)
}

function Scene() {
	const floatGroup = useRef()
	const currentView = appState(state => state.currentView)

	useFrame(state => {
		const { camera } = state
		const t = state.clock.getElapsedTime()
		floatGroup.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 30)
	})

	// const getUniverseStores = appState(state => state.getUniverseStores)
	// const { sectionPositions } = getUniverseStores()
	// console.log(sectionPositions)

	return (
		<group ref={floatGroup}>
			<HirecoUniverse />
			<ContentHolder visible={currentView == 'page'} />
		</group>
	)
}

export default App

function ContentOverlay(props) {
	// const { returnCameraToOrigin } = props

	const setActiveRing = appState(state => state.setActiveRing)
	const setCurrentView = appState(state => state.setCurrentView)

	return (
		<div className={`wrap absolute z-40 h-screen  items-center pl-10 pr-10 grad-left flex pointer-events-none max-w-sm`}>
			<div className='content text-white '>
				<div
					className='back pb-6 pointer-events-auto cursor-pointer'
					onClick={() => {
						setActiveRing('none')
						setCurrentView('main')
						// returnCameraToOrigin()
						// setScrollControlsInitiated(false)
					}}
				>
					<span className='uppercase font-bold tracking-wider'>Back</span>
				</div>
				{/* {currentView == 'page' ? (
							<>
								<div className='w-1/2'>
									<p>{content[activePage]}</p>
								</div>
							</>
						) : (
							<></>
						)} */}

				<div className='flex pt-6'>
					<div
						className='read-more  pointer-events-auto cursor-pointer'
						onClick={() => {
							// setActiveRing('pageSection')
							setCurrentView('page')
							// setIsAnimating(true)
						}}
					>
						<span className='uppercase font-bold tracking-wider pr-2 text-[#d19a41]'>Read More</span>
					</div>
				</div>
			</div>
			{/* </div> */}
		</div>
	)
}
