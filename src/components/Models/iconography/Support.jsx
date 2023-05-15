import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function SupportSection(props) {
	const group = useRef()
	const { nodes, materials, animations } = useGLTF('./models/iconography/INCONOGRAPHY_support_v6.glb')
	const { actions } = useAnimations(animations, group)

	// console.log(actions)

	useEffect(() => {
		// actions['Action'].play()
		actions['Action.001'].play()
		actions['hourGlass.Action'].play()
		actions['hourglass.Action'].play()
		actions['hourglass.Action.001'].play()
		actions['hourglass_3_1Action'].play()
		actions['hourglass_3_2Action'].play()
		actions['hourglass_3_3Action'].play()
		actions['hourglass_3_4Action'].play()
		actions['hourglass_3_5Action'].play()
		actions['hourglass_4_1Action'].play()
		actions['hourglass_4_2Action'].play()
		actions['hourglass_4_3Action'].play()
		actions['hourglass_4_4Action'].play()
		actions['hourglass_4_5Action'].play()
		actions['spannerAction'].play()
	}, [])

	return (
		<group ref={group} {...props} dispose={null}>
			<group name='Scene'>
				<group name='hourGlass'>
					<group name='hourglass_null_1' rotation={[0, 0, 0.12]} scale={0}>
						<mesh name='hourglass_3_1' castShadow receiveShadow geometry={nodes.hourglass_3_1.geometry} material={materials.orange} position={[0, -0.4, 0]} scale={0} />
						<mesh name='hourglass_3_2' castShadow receiveShadow geometry={nodes.hourglass_3_2.geometry} material={materials.orange} position={[0, -0.31, 0]} scale={0} />
						<mesh name='hourglass_3_3' castShadow receiveShadow geometry={nodes.hourglass_3_3.geometry} material={materials.orange} position={[0, -0.2, 0]} scale={0} />
						<mesh name='hourglass_3_4' castShadow receiveShadow geometry={nodes.hourglass_3_4.geometry} material={materials.orange} position={[0, -0.09, 0]} scale={0} />
						<mesh name='hourglass_3_5' castShadow receiveShadow geometry={nodes.hourglass_3_5.geometry} material={materials.orange} position={[0, -0.02, 0]} scale={0} />
						<mesh name='hourglass_4_1' castShadow receiveShadow geometry={nodes.hourglass_4_1.geometry} material={materials.orange} position={[0, 0.4, 0]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-0.29, -0.44, -0.29]} />
						<mesh name='hourglass_4_2' castShadow receiveShadow geometry={nodes.hourglass_4_2.geometry} material={materials.orange} position={[0, 0.31, 0]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-0.29, -0.44, -0.29]} />
						<mesh name='hourglass_4_3' castShadow receiveShadow geometry={nodes.hourglass_4_3.geometry} material={materials.orange} position={[0, 0.2, 0]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-0.29, -0.44, -0.29]} />
						<mesh name='hourglass_4_4' castShadow receiveShadow geometry={nodes.hourglass_4_4.geometry} material={materials.orange} position={[0, 0.09, 0]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-0.29, -0.44, -0.29]} />
						<mesh name='hourglass_4_5' castShadow receiveShadow geometry={nodes.hourglass_4_5.geometry} material={materials.orange} position={[0, 0.02, 0]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-0.29, -0.44, -0.29]} />
						<mesh name='hourglass_1' castShadow receiveShadow geometry={nodes.hourglass_1.geometry} material={materials.orangeGlass} />
						<mesh name='hourglass_2' castShadow receiveShadow geometry={nodes.hourglass_2.geometry} material={materials.orange} />
					</group>
				</group>
				<group name='spanner'>
					<group name='hourglass_null_1001' rotation={[0, 0, 0.12]} />
					<mesh name='spanner_1' castShadow receiveShadow geometry={nodes.spanner_1.geometry} material={materials.SVGMat} />
					<mesh name='spanner_2' castShadow receiveShadow geometry={nodes.spanner_2.geometry} material={materials.SVGMat}>
						<mesh name='spanner_3' castShadow receiveShadow geometry={nodes.spanner_3.geometry} material={materials.SVGMat} />
					</mesh>
				</group>
			</group>
		</group>
	)
}

useGLTF.preload('./models/iconography/INCONOGRAPHY_support_v6.glb')
