import * as THREE from 'three'
import React, { useRef, Suspense } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
// import glsl from 'vite-plugin-glsl'
// import frag from './glsl/frag.frag'
// import vert from './glsl/vert.vert'
// import frag from './shaders/frag.frag'
import vert from './shaders/vert.vert'
import frag from './shaders/frag.frag'

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

export const Wave = () => {
	const ref = useRef()
	useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()))

	const [image] = useLoader(THREE.TextureLoader, ['./images/1.jpg'])

	return (
		<mesh>
			<planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
			<waveShaderMaterial uColor={'hotpink'} ref={ref} uTexture={image} />
		</mesh>
	)
}
