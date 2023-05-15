import { CameraControls, Environment, PerspectiveCamera, Stars, useScroll } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, Scanline, Vignette } from '@react-three/postprocessing'

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { BlendFunction, KernelSize, Resizer } from 'postprocessing'
import React, { useEffect, useRef, useState } from 'react'

import { Lights } from './components'

import * as THREE from 'three'

import { cameraPositionsStore } from './data/positions'

import { Euler, Vector3 } from 'three'
import { HirecoUniverse } from './components'
import { appState } from './store/store'

import { baseCameraPositions } from './data'

const ArrowSvg = ({ direction = 'back', fill = '#f5f5f5' }) => {
	return (
		<svg
			className={`
    ${direction == 'forward' ? 'transform rotate-180' : ''}
    `}
			xmlns='http://www.w3.org/2000/svg'
			width={25.045}
			height={10.116}
		>
			<defs>
				<clipPath id='a'>
					<path data-name='Rectangle 1' fill={fill} d='M0 0h25.045v10.116H0z' />
				</clipPath>
			</defs>
			<g data-name='Group 2'>
				<g data-name='Group 1' clipPath='url(#a)'>
					<path data-name='Path 1' d='M25.045 6.19H6.476v3.931L0 5.057 6.473 0v3.928h18.574Z' fill={fill} />
				</g>
			</g>
		</svg>
	)
}

const FocusPanel = position => {
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
						<ArrowSvg />
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
						<ArrowSvg direction={'forward'} fill={'#d19a41'} />
					</div>
				</div>
			</div>
		</div>
	)
}

function App() {
	const [loaded, setLoaded] = useState(false)

	const activeRing = appState(state => state.activeRing)
	const setActiveRing = appState(state => state.setActiveRing)
	return (
		<>
			<FocusPanel></FocusPanel>
			{activeRing != 'none' ? (
				<div className={`wrap absolute z-40 h-screen  items-center pl-10 pr-10 grad-left flex `}>
					{/* <div className={`relative ${handleSide(side)}`}> */}
					<div className='content text-white w-2/5'>
						<div
							className='back flex items-center pb-6 cursor-pointer'
							onClick={() => {
								setActiveRing('none')
							}}
						>
							<ArrowSvg />
							<span className='pl-2 uppercase font-bold tracking-wider'>Back</span>
						</div>

						<div
							className='read-more flex items-center pb-6 cursor-pointer pt-20'
							onClick={() => {
								setActiveRing('pageSection')
							}}
						>
							<span className='pl-2 uppercase font-bold tracking-wider pr-2 text-[#d19a41]'>Read More</span>
							<ArrowSvg direction={'forward'} fill={'#d19a41'} />
						</div>
					</div>
					{/* </div> */}
				</div>
			) : (
				<></>
			)}
			<Canvas className='relative' style={{ height: '100vh' }} shadows gl={{ alpha: false }} onCreated={() => {}}>
				<mesh>
					<sphereGeometry args={[0.1, 64, 64]} />
					<meshBasicMaterial side={THREE.BackSide} />
				</mesh>
				<HirecoUniverse />
				<Environment files='./environment/nedula.hdr' background={true} blur={0.1} rotation={5} />
				<ambientLight intensity={0.1} />
				<Lights />
				<directionalLight position={[0, 0, 5]} color='red' />
				<color attach='background' args={['#191920']} opacity={1} />
				<fog attach='fog' args={['#000000', 0.6, 1.8]} />
				<Scene></Scene>
			</Canvas>
		</>
	)
}

const Scene = () => {
	const DEG2RAD = degrees => degrees * (Math.PI / 180)

	const cameraControlsRef = useRef()
	const cameraRef = useRef()
	const [aspects, setAspects] = useState([0.15, 0.1])
	const [cameraFov, setCameraFov] = useState(75)

	const [cameraPositions, setCameraPositions] = useState(baseCameraPositions)

	const activeSlide = appState(state => state.activeSlide)
	const activeRing = appState(state => state.activeRing)

	const returnToCameraOrigin = () => {
		cameraControlsRef.current?.setTarget(cameraPositions[0].target.x, cameraPositions[0].target.y, cameraPositions[0].target.z, true)
		cameraControlsRef.current?.setPosition(cameraPositions[0].position.x, cameraPositions[0].position.y, cameraPositions[0].position.z, true)
	}

	function updateCameraPosition() {
		if (activeRing == 'none') return null
		if (!cameraControlsRef.current) return null
		cameraControlsRef.current?.setTarget(cameraPositionsStore.focus[activeRing].target.x, cameraPositionsStore.focus[activeRing].target.y, cameraPositionsStore.focus[activeRing].target.z, true)
		cameraControlsRef.current?.setPosition(cameraPositionsStore.focus[activeRing].position.x, cameraPositionsStore.focus[activeRing].position.y, cameraPositionsStore.focus[activeRing].position.z, true)
		// cameraControlsRef.current?.rotation(cameraPositionsStore.focus[activeSlide].rotation._x, cameraPositionsStore.focus[1].rotation._y, cameraPositionsStore.focus[1].rotation._z, true)
	}

	useEffect(() => {
		if (activeRing == 'none') return returnToCameraOrigin()
		updateCameraPosition()
	}, [activeRing])

	useEffect(() => {
		// cameraRef.current.lookAt(0, 0, 0)
	}, [])

	useFrame(state => {
		const { camera } = state
		const t = state.clock.getElapsedTime()
		const { x, y, z } = activeCameraSettings.position
		cameraControlsRef.current.setLookAt(x, y, z, 0, 0, 0)
		// camera.lookAt(0, 100, 0)
		// camera.position.x = t / 100
		// camera.rot/ation.x = t / 100
		// camera.position.x += 0.1
		// camera.position.z = target.position.z + radius * Math.sin(constant * elapsedTime)
		// camera.lookAt(target.position)
	})

	const [activeCameraSettings, setActiveCameraSettings] = useState({
		target: { x: cameraPositions[0].target.x, y: cameraPositions[0].target.y, z: cameraPositions[0].target.z },
		position: { x: cameraPositions[0].position.x, y: cameraPositions[0].position.y, z: cameraPositions[0].position.z },
		rotation: { x: cameraPositions[0].rotation._x, y: cameraPositions[0].rotation._y, z: cameraPositions[0].rotation._z }
	})

	function updateActiveCameraSettings(position, rotation, quaternion, target) {
		position = new Vector3(position.x, position.y, position.z, true)
		rotation = new Euler(rotation._x, rotation._y, rotation._z, rotation._order)
		// cameraControlsRef.current?.setPosition(position.x, position.y, position.z)
		// cameraControlsRef.current?.setrotation(rotation._x, rotation._y, rotation._z)
		setActiveCameraSettings({ position: position, rotation: rotation, quaternion: quaternion, target: target })
	}

	let obj = {}
	cameraPositions.forEach(
		(a, i) =>
			(obj[i] = () => {
				cameraControlsRef.current?.setTarget(cameraPositions[i].target.x, cameraPositions[i].target.y, cameraPositions[i].target.z, true)
				cameraControlsRef.current?.setPosition(cameraPositions[i].position.x, cameraPositions[i].position.y, cameraPositions[i].position.z, true)
				// cameraControlsRef.current?.setPosition(cameraPositions[i].position.x, cameraPositions[i].position.y, cameraPositions[i].position.z, true)
				// cameraControlsRef.current?.rotation(cameraPositions[i].rotation._x, cameraPositions[i].rotation._y, cameraPositions[i].rotation._z, true)
				// cameraControlsRef.current?.rotation(cameraPositions[i].rotation._x, cameraPositions[i].rotation._y, cameraPositions[i].rotation._z, true)
				// const cameraQuanternion = new Quaternion(cameraPositions[i].quaternion._x, cameraPositions[i].quaternion._y, cameraPositions[i].quaternion._z, cameraPositions[i].quaternion._w)
			})
	)

	let cameraPositionStoreObj = {}
	Object.keys(cameraPositionsStore.focus).forEach(
		(a, i) =>
			(cameraPositionStoreObj[i] = () => {
				cameraControlsRef.current?.setTarget(cameraPositionsStore.focus[a].target.x, cameraPositionsStore.focus[a].target.y, cameraPositionsStore.focus[a].target.z, true)
				cameraControlsRef.current?.setPosition(cameraPositionsStore.focus[a].position.x, cameraPositionsStore.focus[a].position.y, cameraPositionsStore.focus[a].position.z, true)
				// cameraControlsRef.current?.rotation(cameraPositionsStore.focus[a].rotation._x, cameraPositionsStore.focus[a].rotation._y, cameraPositionsStore.focus[a].rotation._z, true)
				// updateActiveCameraSettings(cameraPositionsStore.focus[a].position, cameraPositionsStore.focus[a].rotation, cameraPositionsStore.focus[a].quaternion, cameraPositionsStore.focus[a].target)
			})
	)

	const [cameraPositionOpts, setCameraPositionOpts] = useState(obj)
	const { camera } = useThree()

	function getCameraInformation(e) {
		let cameraInformation = {}
		// console.log(cameraControlsRef.current)
		cameraInformation.position = cameraControlsRef.current._camera.position.clone()
		cameraInformation.rotation = cameraControlsRef.current._camera.rotation.clone()
		cameraInformation.quaternion = cameraControlsRef.current._camera.quaternion.clone()
		cameraInformation.target = cameraControlsRef.current._target.clone()
		console.log(cameraInformation)
	}

	return (
		<>
			<>
				{/* <PresentationControls snap global zoom={0.8} rotation={[0, -Math.PI / 4, 0]} polar={[0, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}> */}
				{/* <PresentationControls snap global zoom={2} rotation={[0, -Math.PI / 5, 0]} polar={[0, Math.PI / 10]} azimuth={[-Math.PI / 2, Math.PI / 2]} speed={-1}> */}
				<CameraControls
					ref={cameraControlsRef}
					onEnd={e => getCameraInformation(e)}
					// camera={cameraRef}
					// quaternion={[-1, 5, 0, 0]}
					makedefault
					// target={vector3}
					// rotation={cameraPositions[0].rotation}
					// position={cameraPositions[0].position}
					// quaternion={cameraPositions[0].quaternion}
				/>
				<PerspectiveCamera
					ref={cameraRef}
					makeDefault
					manual
					aspect={aspects[0] / aspects[1]}
					fov={cameraFov}
					// position={Object.values(cameraPositions[0].position)}
					near={0.01}
					// lookAt={[1, 1, 1]}

					// rotation={Object.values(cameraPositions[0].rotation)}
				/>
				{/* </PresentationControls> */}
				<Environment files='./environment/nedula_bright.hdr' blur={0.1}></Environment>

				<EffectComposer>
					<Bloom
						intensity={1}
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
					<Noise opacity={0.075} />
					<Scanline
						blendFunction={BlendFunction.OVERLAY} // blend mode
						density={0.6} // scanline density
						opacity={0.025} // scanline opacity
					/>
					{/* <SSAO samples={25} intensity={20} luminanceInfluence={0.5} radius={0.2} scale={0.5} bias={0.5} />
						<SMAA edgeDetectionMode={EdgeDetectionMode.DEPTH} /> */}
				</EffectComposer>

				<Stars />
			</>
		</>
	)
}
export default App

{
	/* <Suspense fallback={<Fallback />}> */
}
{
	/* <orthographicCamera ref={cameraRef} makedefault attach='shadow-camera' left={-90} right={20} top={20} bottom={-20} /> */
}
