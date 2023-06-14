import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function Arrow(props) {
	const group = useRef()
	const { nodes, materials, animations } = useGLTF('./models/INCONOGRAPHY_ArrowDirectory_v2.glb')
	const { actions } = useAnimations(animations, group)
	return (
		<group ref={group} {...props} dispose={null} scale-x={-1} position={[-1, 0, 0]}>
			<group name='Scene'>
				<mesh name='ArrowDirectory' castShadow receiveShadow geometry={nodes.ArrowDirectory.geometry} material={materials['Hireco - Wifi .006']} />
			</group>
		</group>
	)
}

useGLTF.preload('./models/INCONOGRAPHY_ArrowDirectory_v2.glb')
