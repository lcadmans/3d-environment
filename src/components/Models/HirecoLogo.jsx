import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function HirecoLogo(props) {
	const { nodes, materials } = useGLTF('./models/universe/ICONOGRAPHY__HMiddle_v2.glb')
	return (
		<group {...props} dispose={null}>
			<group name='Scene'>
				<mesh name='hirecoH_2' castShadow receiveShadow geometry={nodes.hirecoH_2.geometry} material={materials['Hireco - HCircle- 1.003']} scale={14} />
				<mesh name='hirecoH_1' castShadow receiveShadow geometry={nodes.hirecoH_1.geometry} material={materials['Hireco - HCircle- 1.002']} />
				<mesh name='ring_1' castShadow receiveShadow geometry={nodes.ring_1.geometry} material={materials['Hireco - HCircle- 1.001']} />
			</group>
		</group>
	)
}

useGLTF.preload('./models/universe/ICONOGRAPHY__HMiddle_v2.glb')
