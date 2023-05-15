import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Lights(props) {
	const { nodes, materials } = useGLTF('./models/lights/lights_v1.glb')
	return (
		<group {...props} dispose={null}>
			<pointLight intensity={1} decay={2} position={[-0.26, 0.36, 0.96]} rotation={[-Math.PI / 2, 0, 0]} />
		</group>
	)
}

useGLTF.preload('./models/lights/lights_v1.glb')
