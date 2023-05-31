import * as THREE from 'three'
import { Object3D } from 'three'
import { shallow } from 'zustand/shallow'
import React, { useRef, Suspense, useEffect } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { animated, a, update, useSpring, config } from '@react-spring/three'

import { appState } from '../../store'

const tryRequire = path => {
	try {
		return require(`${path}`)
	} catch (err) {
		return null
	}
}

export const TilePlane = props => {
	const { imageSrc, title, subtitle, description, cta, id, planeArgs, activeCameraPosition, position } = props

	const activeTile = appState(state => state.activeTile)
	// const cameraControlsRef = appState(state => state.cameraControlsRef, shallow)
	const setActiveTile = appState(state => state.setActiveTile)
	const activeTileRef = appState(state => state.activeTileRef)
	const setActiveTileRef = appState(state => state.setActiveTileRef)

	const ref = useRef()
	const meshRef = useRef()
	const groupRef = useRef()

	// let _imageSrc = imageSrc || '1.jpg'
	// console.log(imageSrc)

	// _imageSrc = '1.jpg'

	useFrame(state => {
		const { clock, camera } = state

		// let vec3 = meshRef.current.position
		// let middlePoint = new THREE.Vector3()
		// middlePoint.lerpVectors(camera.position, vec3, 0.5)

		if (activeTile == id) {
			// meshRef.current.position.set(...new THREE.Vector3(0, 0, 0))
			// camera.position.set(...Object.values(middlePoint))
			// meshRef.current.scale.x = 2
			// meshRef.current.scale.y = 2
		}
		// console.log(camera)
		// }
		// ref.current.uOpacity = 0.2
		// 	ref.current.uOpacity = 1
	})

	useEffect(() => {
		if (activeTile == id) {
			setFocusElementRef(meshRef)
			// camera.position.set(...Object.values(middlePoint))
			// meshRef.current.scale.x = 2
			// meshRef.current.scale.y = 2
			// meshRef.current.scale.x = 2
			// meshRef.current.scale.y = 2
			// let _activeCameraPosition = new THREE.Vector3(...Object.values(activeCameraPosition))
			// let _sectionPosition = sectionPosition
			// var dir = new THREE.Vector3()
			// groupRef.current.getWorldPosition(dir).normalize()
			// console.log(groupRef)
			// dir.subVectors(_activeCameraPosition, meshRef.current.getWorldPosition(dir)).normalize()
			// groupRef.current.position.x = 0
			// meshRef.current.translateOnAxis(dir, 0.1)
			// meshRef.current.position.set(0, 0, 0)
		} else {
		}
		// else if (activeTile && activeTile != id) {
		// 	meshRef.current.scale.x = 0.5
		// 	meshRef.current.scale.y = 0.5
		// } else {
		// 	meshRef.current.scale.x = 1
		// 	meshRef.current.scale.y = 1
		// }
	}, [activeTile])

	useEffect(() => {
		// console.log(activeTile)
	}, [activeTile])

	// console.log(_imageSrc)

	// let _imageSrc
	// _imageSrc = imageSrc[0]

	// console.log(imageSrc)
	// console.log(imageSrc[0])

	let imageString = `./images/${imageSrc}`
	// console.log(imageString)

	// const [image] = useLoader(THREE.TextureLoader, [imageString])
	// console.log(imageString)
	// const adjustedPath = tryRequire(imageString) ? imageString : './images/1.jpg'
	// console.log(tryRequire(imageString))
	// console.log('adjustedPath')
	// console.log(adjustedPath)
	let adjustedPath = imageString
	if (!adjustedPath.includes('EXPERTS')) adjustedPath = './images/1.jpg'
	// console.log(adjustedPath)
	const [image] = useLoader(THREE.TextureLoader, [adjustedPath])

	// console.log(ratios[1])

	// let middlePoint = new THREE.Vector3()
	// middlePoint.lerpVectors(_sectionPosition, _activeCameraPosition, 1)

	// if (meshRef.current) meshRef.current.getWorldPosition(dir)
	// console.log(dir)
	// if (meshRef.current) dir.subVectors(_activeCameraPosition, meshRef.current.getWorldPosition(dir)).normalize()

	// console.log(dir)

	// console.log(middlePoint)

	// let basePoint =
	// if (meshRef.current) vec3 = meshRef.current.position
	// else vec3 = new THREE.Vector3(0, 0, 0)
	// console.log(vec3)
	// let _activeCameraPosition = new THREE.Vector3(Object.values(activeCameraPosition))
	// // console.log('_activeCameraPosition')
	// // console.log(_activeCameraPosition)

	// function getActiveGroupPosition() {
	// 	return [0, 0, 0.1]
	// }

	const { activeScale, groupScale, activeOpacity } = useSpring({
		// groupPosition: activeTile === id ? getActiveGroupPosition() : [0, 0, 0],
		activeScale: activeTile === id ? 1.5 : 1,
		groupScale: activeTile && activeTile != id ? 0.7 : 1,
		activeOpacity: activeTile === id ? 1 : 0.2,
		config: config.gentle
	})

	// console.log(activeCameraPosition)

	// console.log(cameraControlsRef)
	useEffect(() => {
		if (!activeTileRef) return
		// console.log('activeTileRef')
		// console.log(activeTileRef)
	}, [activeTileRef])

	const focusElementRef = appState(state => state.focusElementRef, shallow)
	const setFocusElementRef = appState(state => state.setFocusElementRef, shallow)

	return (
		<animated.mesh scale={groupScale}>
			{/* <animated.mesh position={groupPosition} scale={activeScale}> */}
			<animated.mesh scale={activeScale}>
				<group ref={groupRef}>
					{/* <mesh
				position={[0, 0.2, 0]}
				ref={meshRef}
				onClick={() => {
					console.log('tileClick')
					setActiveTile(id)
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
				<planeBufferGeometry args={planeArgs} />
				<waveShaderMaterial uColor={'hotpink'} ref={ref} uTexture={image} side={THREE.DoubleSide} />
			</mesh> */}
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
