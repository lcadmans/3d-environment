import React, { useRef } from 'react'
import { useGLTF, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { appState } from '../../store'

export function HirecoLogo(props) {
	const { nodes, materials } = useGLTF('./models/universe/hireco_3DScene_GMiddle_v3.glb')
	const currentView = appState(state => state.currentView)
	const setCurrentView = appState(state => state.setCurrentView)
	return (
		<group
			{...props}
			dispose={null}
			onClick={() => setCurrentView('HirecoCenter')}
			onPointerOver={() => {
				document.body.style.cursor = 'pointer'
			}}
			onPointerOut={() => {
				document.body.style.cursor = 'default'
			}}
		>
			<Sphere scale={0.5}>
				<meshStandardMaterial color='black' transparent opacity={0.1} side={THREE.BackSide} />
			</Sphere>
			<mesh castShadow receiveShadow geometry={nodes.hirecoH_2.geometry} material={materials['Hireco - HCircle- 1.003']} />
			<mesh castShadow receiveShadow geometry={nodes.ring_1.geometry} material={materials['Hireco - HCircle- 1.001']} />
			<mesh castShadow receiveShadow geometry={nodes.hirecoH_1.geometry} material={materials['Hireco - HCircle- 1.002']} />
		</group>
	)
}

useGLTF.preload('./models/universe/hireco_3DScene_GMiddle_v3.glb')
