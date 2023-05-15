import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function SourceSection(props) {
	const group = useRef()
	const { nodes, materials, animations } = useGLTF('./models/iconography/INCONOGRAPHY_source_v1.glb')
	const { actions } = useAnimations(animations, group)

	useEffect(() => {
		actions['Action'].play()
		actions['vanAction'].play()
		actions['vanWheel_1Action'].play()
		actions['vanWheel_2Action'].play()
		actions['vanWheel_3Action'].play()
		actions['vanWheel_4Action'].play()
	}, [])

	return (
		<group ref={group} {...props} dispose={null}>
			<group name='Scene'>
				<group name='van'>
					<mesh name='van_1' castShadow receiveShadow geometry={nodes.van_1.geometry} material={materials['H ORANGE.001']} position={[0, 0, 0.19]}>
						<mesh name='van_windows_1' castShadow receiveShadow geometry={nodes.van_windows_1.geometry} material={materials.tintedWindow} />
					</mesh>
					<mesh name='vanWheel_1' castShadow receiveShadow geometry={nodes.vanWheel_1.geometry} material={materials['H ORANGE.001']} position={[-0.3, -0.11, 0.15]} />
					<mesh name='vanWheel_2' castShadow receiveShadow geometry={nodes.vanWheel_2.geometry} material={materials['H ORANGE.001']} position={[0.38, -0.11, 0.15]} />
					<mesh name='vanWheel_3' castShadow receiveShadow geometry={nodes.vanWheel_3.geometry} material={materials['H ORANGE.001']} position={[-0.3, -0.11, -0.15]} />
					<mesh name='vanWheel_4' castShadow receiveShadow geometry={nodes.vanWheel_4.geometry} material={materials['H ORANGE.001']} position={[0.38, -0.11, -0.15]} />
				</group>
			</group>
		</group>
	)
}

useGLTF.preload('./models/iconography/INCONOGRAPHY_source_v1.glb')
