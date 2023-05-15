import { Box, OrbitControls, useGLTF, useAnimations } from '@react-three/drei'
import { useEffect, useRef } from 'react'

export function BulbModel({ index }) {
	const group = useRef()
	const { nodes, materials, animations } = useGLTF('./models/INCONOGRAPHY_v8-T.glb')
	const { actions } = useAnimations(animations, group)
	// const { index } = props
	// console.log('actions')
	// console.log(actions)
	useEffect(() => {
		if (!actions) return
	}, [])

	let scale = 0.4
	return (
		<group
			ref={group}
			// {...props}
			dispose={null}
			scale={scale}
			// scale={1}
			// onPointerOver={() => {}}
		>
			<group name='Scene'>
				<group name='BULB_NULL' scale={0.2}>
					<mesh name='BOTTOM' castShadow receiveShadow geometry={nodes.BOTTOM.geometry} material={materials['H ORANGE']} position={[0, -0.48, 0]} scale={[0.13, 0.04, 0.13]} />
					<mesh name='BOLT' castShadow receiveShadow geometry={nodes.BOLT.geometry} material={materials['EMMISION ANIMATED LIGHT']} />
					<mesh name='MIDDLE' castShadow receiveShadow geometry={nodes.MIDDLE.geometry} material={materials['H ORANGE']} position={[0, -0.36, 0]} rotation={[-0.02, 0, 0]} scale={[0.13, 0.03, 0.13]} />
					<mesh name='BULB' castShadow receiveShadow geometry={nodes.BULB.geometry} material={materials['LIGHT BULB']} position={[0, -0.26, 0]} scale={[0.13, 0.03, 0.13]} />
				</group>
				<mesh name='POUND_SYMBOL' castShadow receiveShadow geometry={nodes.POUND_SYMBOL.geometry} material={materials['H ORANGE']} position={[-0.01, -0.07, 0]} scale={0} />
			</group>
		</group>
	)
}

useGLTF.preload('./models/INCONOGRAPHY_v8-T.glb')
