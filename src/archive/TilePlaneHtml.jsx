import * as THREE from 'three'
import { Object3D } from 'three'
import { shallow } from 'zustand/shallow'
import React, { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial, Html } from '@react-three/drei'
import { animated, a, update, useSpring, config } from '@react-spring/three'

import { appState } from '../store'

const tryRequire = path => {
	try {
		return require(`${path}`)
	} catch (err) {
		return null
	}
}

export const TilePlaneHtml = props => {
	const { imageSrc, title, subtitle, description, cta, id, planeArgs, activeCameraPosition, position } = props

	const activeTile = appState(state => state.activeTile)
	// const cameraControlsRef = appState(state => state.cameraControlsRef, shallow)
	const setActiveTile = appState(state => state.setActiveTile)
	const activeTileRef = appState(state => state.activeTileRef)
	const setActiveTileRef = appState(state => state.setActiveTileRef)

	const ref = useRef()
	const meshRef = useRef()
	const groupRef = useRef()

	useFrame(state => {
		const { clock, camera } = state
	})

	useEffect(() => {
		if (activeTile == id) {
			setFocusElementRef(meshRef)
		} else {
		}
	}, [activeTile])

	useEffect(() => {
		// console.log(activeTile)
	}, [activeTile])

	let imageString = `./images/${imageSrc}`
	let adjustedPath = imageString
	if (!adjustedPath.includes('EXPERTS')) adjustedPath = './images/1.jpg'
	const [image] = useLoader(THREE.TextureLoader, [adjustedPath])

	const { activeScale, groupScale, activeOpacity } = useSpring({
		// groupPosition: activeTile === id ? getActiveGroupPosition() : [0, 0, 0],
		activeScale: activeTile === id ? 1.5 : 1,
		groupScale: activeTile && activeTile != id ? 0.7 : 1,
		activeOpacity: activeTile === id ? 1 : 0.2,
		config: config.gentle
	})

	const [isOccluded, setOccluded] = useState()
	const [isInRange, setInRange] = useState()
	const isVisible = isInRange && !isOccluded

	const focusElementRef = appState(state => state.focusElementRef, shallow)
	const setFocusElementRef = appState(state => state.setFocusElementRef, shallow)

	return (
		<animated.mesh scale={groupScale}>
			<animated.mesh scale={activeScale}>
				<group ref={groupRef}>
					{activeTile == id ? (
						<>
							<Html
								// 3D-transform contents
								transform
								// Hide contents "behind" other meshes
								// occlude
								// Tells us when contents are occluded (or not)
								// onOcclude={setOccluded}
								// We just interpolate the visible state into css opacity and transforms
								style={{ opacity: activeTile == id ? 1 : 0, transform: `scale(${activeTile == id ? 1 : 0.25})`, pointerEvents: `none` }}
								// {...props}
							>
								{/* <div className='text-[1px]'> */}
								{/* <h1>Test Title</h1> */}
								<GenerateContent />
								{/* </div> */}
							</Html>
						</>
					) : (
						<></>
					)}

					<mesh
						// position={[0, 0, 0]}
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
						<planeGeometry attach='geometry' args={[0.1, 0.1]} />
						<a.meshBasicMaterial attach='material' map={image} transparent opacity={activeOpacity} />
					</mesh>
				</group>
			</animated.mesh>
		</animated.mesh>
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
			<div className='max-w-[50px] pointer-events-none leading-[1px] text-white '>
				<h1 className={'text-[1px] text-[#d19a41] font-[600]'}>{title}</h1>
				<h2 className={'text-[0.5px]'}>{subTitle}</h2>
				<p className={'text-[1px] leading-tight'}>{description}</p>
			</div>
		</>
	)
}
