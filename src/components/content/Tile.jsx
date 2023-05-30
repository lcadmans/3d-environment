import * as THREE from 'three'
import { Object3D } from 'three'
import shallow from 'zustand/shallow'
import React, { useRef, Suspense, useEffect } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { animated, a, update, useSpring, config } from '@react-spring/three'

import { appState } from '../../store'

import vert from '../shaders/vert.vert'
import frag from '../shaders/frag.frag'

const WaveShaderMaterial = shaderMaterial(
	// Uniform
	{
		transparent: true,
		// opacity: 0,
		uTime: 0,
		uOpacity: 0.2,
		uColor: new THREE.Color(0.0, 0.0, 0.0),
		uTexture: new THREE.Texture()
	},
	// Vertex Shader
	vert,
	frag
)

extend({ WaveShaderMaterial })

export const Tile = props => {
	const { imageSrc, title, subtitle, description, cta, id, planeArgs } = props

	const activeTile = appState(state => state.activeTile)
	const cameraControlsRef = appState(state => state.cameraControlsRef)
	const setActiveTile = appState(state => state.setActiveTile)

	const ref = useRef()
	const meshRef = useRef()
	const groupRef = useRef()

	// let _imageSrc = imageSrc || '1.jpg'

	// let _imageSrc = imageSrc || '1.jpg'
	let _imageSrc = '1.jpg'

	useFrame(state => {
		const { clock, camera } = state
		ref.current.uTime = clock.getElapsedTime()

		// let vec3 = meshRef.current.position
		// let middlePoint = new THREE.Vector3()
		// middlePoint.lerpVectors(camera.position, vec3, 0.5)

		if (activeTile == id) {
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
			ref.current.uOpacity = 1
		} else {
			ref.current.uOpacity = 0.4
		}
		if (activeTile == id) {
			// camera.position.set(...Object.values(middlePoint))
			// meshRef.current.scale.x = 2
			// meshRef.current.scale.y = 2
			meshRef.current.scale.x = 2
			meshRef.current.scale.y = 2
		} else {
			meshRef.current.scale.x = 1
			meshRef.current.scale.y = 1
		}
	}, [activeTile])

	useEffect(() => {
		// console.log(activeTile)
	}, [activeTile])

	const [image] = useLoader(THREE.TextureLoader, ['./images/' + _imageSrc])

	// console.log(ratios[1])

	return (
		<group ref={groupRef}>
			<mesh
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
			</mesh>
		</group>
	)
}
