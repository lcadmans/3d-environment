/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
	const { nodes, materials } = useGLTF('/Substance Surface Test.glb')
	return (
		<group {...props} dispose={null}>
			<group rotation={[Math.PI / 2, 0, 0]}>
				<mesh castShadow receiveShadow geometry={nodes.Mesh_03_Base.geometry} material={materials._03_Base} />
				<mesh castShadow receiveShadow geometry={nodes.Mesh_02_Body.geometry} material={materials._02_Body} />
				<mesh castShadow receiveShadow geometry={nodes.Mesh_01_Head.geometry} material={materials._01_Head} />
			</group>
		</group>
	)
}

useGLTF.preload('/Substance Surface Test.glb')