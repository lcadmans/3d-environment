// import React, { useRef, useState } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { Model } from './Models/Model'

import { useRef, useState, useEffect, forwardRef, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Grid, Center, AccumulativeShadows, RandomizedLight, Environment, useGLTF, CameraControls, ContactShadows, OrbitControls } from '@react-three/drei'
import { useControls, button, buttonGroup, folder } from 'leva'

import { HexColorPicker } from 'react-colorful'
import { proxy, useSnapshot } from 'valtio'

import * as THREE from 'three'

const { DEG2RAD } = THREE.MathUtils

import './styles/global.css'

const state = proxy({
	current: null,
	items: {
		laces: '#ffffff',
		mesh: '#ffffff',
		caps: '#ffffff',
		inner: '#ffffff',
		sole: '#ffffff',
		stripes: '#ffffff',
		band: '#ffffff',
		patch: '#ffffff'
	}
})

function Shoe(props) {
	const ref = useRef()
	const snap = useSnapshot(state)
	const { nodes, materials } = useGLTF('cam_shoe_v1.glb')
	const [hovered, set] = useState(null)

	useFrame(state => {
		const t = state.clock.getElapsedTime()
		ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
		ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
	})

	useEffect(() => {
		const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
		const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
		if (hovered) {
			document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
			return () => (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`)
		}
	}, [hovered])

	return (
		// <group ref={ref} onPointerOver={e => (e.stopPropagation(), set(e.object.material.name))} onPointerOut={e => e.intersections.length === 0 && set(null)} onPointerMissed={() => (state.current = null)} onClick={e => (e.stopPropagation(), (state.current = e.object.material.name))}>
		// 	<mesh receiveShadow castShadow geometry={nodes.shoe.geometry} material={materials.laces} material-color={snap.items.laces} />
		// 	<mesh receiveShadow castShadow geometry={nodes.shoe_1.geometry} material={materials.mesh} material-color={snap.items.mesh} />
		// 	<mesh receiveShadow castShadow geometry={nodes.shoe_2.geometry} material={materials.caps} material-color={snap.items.caps} />
		// 	<mesh receiveShadow castShadow geometry={nodes.shoe_3.geometry} material={materials.inner} material-color={snap.items.inner} />
		// 	<mesh receiveShadow castShadow geometry={nodes.shoe_4.geometry} material={materials.sole} material-color={snap.items.sole} />
		// 	<mesh receiveShadow castShadow geometry={nodes.shoe_5.geometry} material={materials.stripes} material-color={snap.items.stripes} />
		// 	<mesh receiveShadow castShadow geometry={nodes.shoe_6.geometry} material={materials.band} material-color={snap.items.band} />
		// 	<mesh receiveShadow castShadow geometry={nodes.shoe_7.geometry} material={materials.patch} material-color={snap.items.patch} />
		// </group>
		<group
			{...props}
			// dispose={null}
			ref={ref}
			// onPointerOver={e => (e.stopPropagation(), set(e.object.material.name))}
			// onPointerOut={e => e.intersections.length === 0 && set(null)}
			// onPointerMissed={() => (state.current = null)}
			// onClick={e => (e.stopPropagation(), (state.current = e.object.material.name))}
			// position={[0, 5, 0]}
		>
			<group scale={0.1} rotation={[0.7, -1, 0.3]}>
				<mesh castShadow receiveShadow geometry={nodes.Baked_UA_HOVR_Backlace_v001.geometry} material={materials['WHITE MATTE']} position={[0, 3.58, -4.1]} rotation={[1.92, 0, 0]} />
				<mesh castShadow receiveShadow geometry={nodes.Baked_UA_HOVR_Heelsupport_v001.geometry} material={materials['WHITE MATTE']} position={[0, 3.58, -4.1]} rotation={[1.92, 0, 0]} />
				<mesh castShadow receiveShadow geometry={nodes.Baked_UA_HOVR_Insole_v001.geometry} material={materials['Default OBJ.002']} position={[0, 3.58, -4.1]} rotation={[1.92, 0, 0]} />
				<mesh castShadow receiveShadow geometry={nodes.Baked_UA_HOVR_Lacerestraint_v001.geometry} material={materials['WHITE MATTE']} position={[0, 3.58, -4.1]} rotation={[1.92, 0, 0]} />
				<mesh castShadow receiveShadow geometry={nodes.Baked_UA_HOVR_Laces_v001.geometry} material={materials['WHITE MATTE']} position={[0, 3.58, -4.1]} rotation={[1.92, 0, 0]} />
				<mesh castShadow receiveShadow geometry={nodes.Baked_UA_HOVR_Sole_v001.geometry} material={materials['WHITE MATTE']} position={[0, 3.58, -4.1]} rotation={[1.92, 0, 0]} />
				<mesh castShadow receiveShadow geometry={nodes.Baked_UA_HOVR_Stitches_v001.geometry} material={materials['WHITE MATTE']} position={[0, 3.58, -4.1]} rotation={[1.92, 0, 0]} />
				<mesh castShadow receiveShadow geometry={nodes.Baked_UA_HOVR_Tag_v001.geometry} material={materials['WHITE MATTE']} position={[0, 3.58, -4.1]} rotation={[1.92, 0, 0]} />
				<mesh castShadow receiveShadow geometry={nodes.Baked_UA_HOVR_Upper_v001.geometry} material={materials['WHITE MATTE']} position={[0, 3.58, -4.1]} rotation={[1.92, 0, 0]} />
			</group>
		</group>
	)
}

function Picker() {
	const snap = useSnapshot(state)
	return (
		<div style={{ display: snap.current ? 'block' : 'none' }}>
			<HexColorPicker className='picker' color={snap.items[snap.current]} onChange={color => (state.items[snap.current] = color)} />
			<h1>{snap.current}</h1>
		</div>
	)
}

export default function App() {
	return (
		<>
			<Canvas style={{ height: '100vh' }} shadows camera={{ position: [0, 0, 5], fov: 60 }}>
				<Scene />
				{/* <Shoe /> */}
			</Canvas>
			<Picker />
		</>
	)
}

// function Scene() {
// 	return (
// 		<>
// 			<ambientLight intensity={0.7} />
// 			<spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
// 			<Shoe />
// 			<Environment preset='city' />
// 			<ContactShadows position={[0.1, -0.8, 0]} opacity={0.25} scale={10} blur={1.5} far={0.8} />
// 			<OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} />
// 		</>
// 	)
// }
function Scene() {
	const meshRef = useRef()
	const cameraControlsRef = useRef()

	const { camera } = useThree()

	// All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html
	const { minDistance, enabled, verticalDragToForward, dollyToCursor, infinityDolly } = useControls({
		thetaGrp: buttonGroup({
			label: 'rotate theta',
			opts: {
				'+45º': () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
				'-90º': () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
				'+360º': () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true)
			}
		}),
		phiGrp: buttonGroup({
			label: 'rotate phi',
			opts: {
				'+20º': () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
				'-40º': () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true)
			}
		}),
		truckGrp: buttonGroup({
			label: 'truck',
			opts: {
				'(1,0)': () => cameraControlsRef.current?.truck(1, 0, true),
				'(0,1)': () => cameraControlsRef.current?.truck(0, 1, true),
				'(-1,-1)': () => cameraControlsRef.current?.truck(-1, -1, true)
			}
		}),
		dollyGrp: buttonGroup({
			label: 'dolly',
			opts: {
				1: () => cameraControlsRef.current?.dolly(1, true),
				'-1': () => cameraControlsRef.current?.dolly(-1, true)
			}
		}),
		zoomGrp: buttonGroup({
			label: 'zoom',
			opts: {
				'/2': () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
				'/-2': () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true)
			}
		}),
		minDistance: { value: 0 },
		moveTo: folder(
			{
				vec1: { value: [3, 5, 2], label: 'vec' },
				'moveTo(…vec)': button(get => cameraControlsRef.current?.moveTo(...get('moveTo.vec1'), true))
			},
			{ collapsed: true }
		),
		'fitToBox(mesh)': button(() => cameraControlsRef.current?.fitToBox(meshRef.current, true)),
		setPosition: folder(
			{
				vec2: { value: [-5, 2, 1], label: 'vec' },
				'setPosition(…vec)': button(get => cameraControlsRef.current?.setPosition(...get('setPosition.vec2'), true))
			},
			{ collapsed: true }
		),
		setTarget: folder(
			{
				vec3: { value: [3, 0, -3], label: 'vec' },
				'setTarget(…vec)': button(get => cameraControlsRef.current?.setTarget(...get('setTarget.vec3'), true))
			},
			{ collapsed: true }
		),
		setLookAt: folder(
			{
				vec4: { value: [1, 2, 3], label: 'position' },
				vec5: { value: [1, 1, 0], label: 'target' },
				'setLookAt(…position, …target)': button(get => cameraControlsRef.current?.setLookAt(...get('setLookAt.vec4'), ...get('setLookAt.vec5'), true))
			},
			{ collapsed: true }
		),
		lerpLookAt: folder(
			{
				vec6: { value: [-2, 0, 0], label: 'posA' },
				vec7: { value: [1, 1, 0], label: 'tgtA' },
				vec8: { value: [0, 2, 5], label: 'posB' },
				vec9: { value: [-1, 0, 0], label: 'tgtB' },
				t: { value: Math.random(), label: 't', min: 0, max: 1 },
				'f(…posA,…tgtA,…posB,…tgtB,t)': button(get => {
					return cameraControlsRef.current?.lerpLookAt(...get('lerpLookAt.vec6'), ...get('lerpLookAt.vec7'), ...get('lerpLookAt.vec8'), ...get('lerpLookAt.vec9'), get('lerpLookAt.t'), true)
				})
			},
			{ collapsed: true }
		),
		saveState: button(() => cameraControlsRef.current?.saveState()),
		reset: button(() => cameraControlsRef.current?.reset(true)),
		enabled: { value: true, label: 'controls on' },
		verticalDragToForward: { value: false, label: 'vert. drag to move forward' },
		dollyToCursor: { value: false, label: 'dolly to cursor' },
		infinityDolly: { value: false, label: 'infinity dolly' }
	})

	return (
		<>
			<group position-y={-1}>
				{/* <Center top> */}
				{/* <Suzi ref={meshRef} rotation={[-0.63, 0, 0]} /> */}
				<group position-y={0.5}>
					<Shoe ref={meshRef} />
				</group>
				{/* </Center> */}
				<Ground />
				<Shadows />
				<CameraControls ref={cameraControlsRef} minDistance={minDistance} enabled={enabled} verticalDragToForward={verticalDragToForward} dollyToCursor={dollyToCursor} infinityDolly={infinityDolly} />
				<Environment preset='city' />
			</group>
		</>
	)
}

function Ground() {
	const gridConfig = {
		cellSize: 0.5,
		cellThickness: 0.5,
		cellColor: '#6f6f6f',
		sectionSize: 3,
		sectionThickness: 1,
		sectionColor: '#9d4b4b',
		fadeDistance: 30,
		fadeStrength: 1,
		followCamera: false,
		infiniteGrid: true
	}
	return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}

const Shadows = memo(() => (
	<AccumulativeShadows temporal frames={100} color='#9d4b4b' colorBlend={0.5} alphaTest={0.9} scale={20}>
		<RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
	</AccumulativeShadows>
))

const Suzi = forwardRef((props, ref) => {
	const { nodes } = useGLTF('https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf')
	return (
		<>
			<mesh ref={ref} castShadow receiveShadow geometry={nodes.Suzanne.geometry} {...props}>
				<meshStandardMaterial color='#9d4b4b' />
			</mesh>
		</>
	)
})
