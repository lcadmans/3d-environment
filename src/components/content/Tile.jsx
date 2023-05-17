import * as THREE from 'three'
import React, { useRef, Suspense } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

import vert from '../shaders/vert.vert'
import frag from '../shaders/frag.frag'

const WaveShaderMaterial = shaderMaterial(
	// Uniform
	{
		uTime: 0,
		uColor: new THREE.Color(0.0, 0.0, 0.0),
		uTexture: new THREE.Texture()
	},
	// Vertex Shader
	vert,
	frag
)

extend({ WaveShaderMaterial })

export const Tile = props => {
	const { imageSrc, title, subtitle, description, cta } = props
	let _imageSrc = imageSrc || '1.jpg'
	const ref = useRef()
	useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()))

	const [image] = useLoader(THREE.TextureLoader, ['./images/' + _imageSrc])

	let randomCount = Math.floor(Math.random() * (2 - 1 + 1) + 1)
	let ratios = [
		[0.04, 0.03],
		[0.025, 0.05]
	]

	// console.log(ratios[1])

	return (
		<mesh scale={1} position={[0, 0.2, 0]}>
			<planeBufferGeometry args={[...ratios[randomCount - 1], 5, 5]} />
			<waveShaderMaterial uColor={'hotpink'} ref={ref} uTexture={image} side={THREE.DoubleSide} />
		</mesh>
	)
}
