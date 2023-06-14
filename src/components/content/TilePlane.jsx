import * as THREE from 'three'
import { Object3D } from 'three'
import { shallow } from 'zustand/shallow'
import React, { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial, Plane, Html, Line } from '@react-three/drei'
import { animated, a, update, useSpring, config } from '@react-spring/three'

import { appState } from '../../store'

export const TilePlane = props => {
	const { imageSrc, id, linePoints } = props

	const activeTile = appState(state => state.activeTile)
	// const cameraControlsRef = appState(state => state.cameraControlsRef, shallow)
	const activeRing = appState(state => state.activeRing, shallow)
	const setActiveTile = appState(state => state.setActiveTile)
	const activeTileRef = appState(state => state.activeTileRef)
	const setActiveTileRef = appState(state => state.setActiveTileRef)
	const focusElementRef = appState(state => state.focusElementRef, shallow)
	const setFocusElementRef = appState(state => state.setFocusElementRef)

	const ref = useRef()
	const meshRef = useRef()
	const groupRef = useRef()
	const sizes = { ring_2: [0.65, 0.65], ring_3: [0.65 * 2, 0.65 * 2], ring_4: [0.65 * 5, 0.65 * 5], ring_5: [0.65 * 7.5, 0.65 * 7.5], ring_6: [0.65 * 10, 0.65 * 10] }

	useFrame(state => {
		const { clock, camera } = state
	})

	useEffect(() => {
		if (activeTile == id) {
			setFocusElementRef(groupRef)
		} else {
		}
	}, [activeTile])

	let imageString
	if (!imageSrc) imageString = `./images/${'hireco_dummy.jpeg'}`
	else imageString = `./images/${imageSrc}`

	let adjustedPath = imageString
	// if (adjustedPath.includes('.mp4')) adjustedPath = './images/dummy.mp4'
	// if (!adjustedPath.includes('EXPERTS')) adjustedPath = './images/1.jpg'

	if (adjustedPath.includes('dummy.mp4') == true) {
		adjustedPath = './images/hireco_dummy.jpeg'
	}

	if (adjustedPath.includes('.mp4') && adjustedPath.includes('dummy.mp4') == false) {
		// console.log('adjustedPath')
		// console.log(adjustedPath)
		// imageSrc =
		// adjustedPath = './images/video screens/Play.png'

		// console.log(imageSrc.replace('.mp4', '.png'))
		adjustedPath = './images/video screens/' + imageSrc.replace('.mp4', '.png')
		// adjustedPath = './images/hireco_dummy.jpeg'
	}

	if (adjustedPath.includes('.gif')) adjustedPath = './images/hireco_dummy.jpeg'

	let image
	try {
		;[image] = useLoader(THREE.TextureLoader, [adjustedPath])
	} catch (e) {
		image = useLoader(THREE.TextureLoader, ['./images/hireco_dummy.jpeg'])
	}

	const { activeScale, groupScale, activeOpacity, activeRenderOrder, depthTestBoolean } = useSpring({
		// groupPosition: activeTile === id ? getActiveGroupPosition() : [0, 0, 0],
		activeScale: activeTile === id ? 2 : 1,
		activeRenderOrder: activeTile === id ? 100 : -5,
		groupScale: activeTile && activeTile != id ? 0.7 : 1,
		depthTestBoolean: activeTile === id ? true : false,
		activeOpacity: activeTile === id ? 1 : 0.75,
		config: config.gentle
	})

	useEffect(() => {
		// console.log('activeRing')
		// console.log(activeRing)
	}, [])

	// return <></>

	return (
		<animated.mesh scale={groupScale}>
			<animated.mesh scale={activeScale}>
				<group ref={groupRef}>
					{activeTile == id ? (
						<>
							<group
								position-x={0.4}
								position-y={0.4}
								// rotation-y={-0.2}
							>
								<Html prepend style={{ opacity: activeTile == id ? 1 : 0, transform: `scale(${activeTile == id ? 1 : 0.25})`, pointerEvents: 'none' }}>
									<GenerateContent />
								</Html>
							</group>
						</>
					) : (
						<></>
					)}

					<mesh
						ref={meshRef}
						onClick={() => {
							console.log('tileClick')
							setActiveTile(id)
							setActiveTileRef(meshRef)
						}}
						onPointerOver={() => {
							document.body.style.cursor = 'pointer'
						}}
						onPointerOut={() => {
							document.body.style.cursor = 'default'
						}}
						depthTest={false}
						renderOrder={10}
					>
						<planeGeometry attach='geometry' args={sizes[activeRing]} />
						<a.meshBasicMaterial
							attach='material'
							map={image}
							transparent
							opacity={activeOpacity}
							// depthTest={depthTestBoolean}
							// depthWrite={false} polygonOffset={true} polygonOffsetFactor={activeRenderOrder}
						/>
					</mesh>

					<Plane args={[0.1, 0.1]} position-x={3}>
						<meshStandardMaterial transparent opacity={0} alpha={true} depthTest={false} />
					</Plane>
				</group>
			</animated.mesh>
		</animated.mesh>
	)
}

function GenerateContent(props) {
	const activeTile = appState(state => state.activeTile, shallow)
	const getContentByTitle = appState(state => state.getContentByTitle)
	const activeRing = appState(state => state.activeRing, shallow)
	const ringNames = appState(state => state.ringNames)
	const fetchData = appState(state => state.fetchData, shallow)

	const ringName = ringNames[activeRing]

	const currentSectionCopy = fetchData.filter(item => item.id == activeTile)[0]

	// console.log(currentSectionCopy)

	// const { subTitle: categorySubTitile, description: categoryDescription } = currentSectionCopy

	let title, subTitle, description, cta

	// if (activeTileContent) {
	title = currentSectionCopy.title
	subTitle = currentSectionCopy.subtitle
	description = currentSectionCopy.description
	// } else {
	// 	title = ringName
	// 	subTitle = categorySubTitile
	// 	description = categoryDescription
	// 	cta = 'Read More'
	// }
	return (
		<>
			<div className='w-[30vw]  text-white bg-black p-4 bg-opacity-50 transform-gpu pointer-events-none '>
				<h1 className={'text-[3em] text-[#d19a41] font-[600]'}>{title}</h1>
				<h2 className={'text-[2em]'}>{subTitle}</h2>
				<p className={'text-[1em] leading-tight'}>{description}</p>
			</div>
		</>
	)
}
