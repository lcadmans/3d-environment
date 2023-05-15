import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Arrow(props) {
	const { nodes, materials } = useGLTF('./models/misc/INCONOGRAPHY_arrow_v1.glb')
	return (
		<group {...props} dispose={null}>
			<mesh name='Cube001' castShadow receiveShadow geometry={nodes.Cube001.geometry} material={materials['Hireco - Arrow 1']} position={[0.08, 0, -0.06]} rotation={[0, -Math.PI / 2, 0]} scale={2.11} />
		</group>
	)
}

useGLTF.preload('./models/misc/INCONOGRAPHY_arrow_v1.glb')
