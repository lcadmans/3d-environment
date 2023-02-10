// import React, { useRef, useState } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { Model } from './Models/Model'

import { useRef, useState, useEffect, forwardRef, memo, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Grid, Center, AccumulativeShadows, RandomizedLight, Environment, useGLTF, CameraControls, ContactShadows, OrbitControls, PresentationControls, Trail, Sphere } from '@react-three/drei'
import { useControls, button, buttonGroup, folder } from 'leva'
import { useSpring, a } from '@react-spring/three'

import { HexColorPicker } from 'react-colorful'
import { proxy, useSnapshot } from 'valtio'

import * as THREE from 'three'
import { BufferAttribute, DoubleSide } from 'three'

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

export default function Mesh() {
	return (
		<>
			<Canvas style={{ height: '100vh' }} shadows camera={{ position: [0, 0, 5], fov: 60 }}>
				{/* <OrbitControls global zoom={0.8} rotation={[0, -Math.PI / 4, 0]} polar={[0, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}> */}
				<PresentationControls global zoom={0.8} rotation={[0, -Math.PI / 4, 0]} polar={[0, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}>
					<Scene />
					{/* <Shoe /> */}
				</PresentationControls>
				{/* </OrbitControls> */}
			</Canvas>
			<Picker />
		</>
	)
}

// function BufferPoints({ count = 1000 }) {
// 	const points = useMemo(() => {
// 		const p = new Array(count).fill(0).map(v => (0.5 - Math.random()) * 7.5)
// 		return new BufferAttribute(new Float32Array(p), 3)
// 	}, [count])

// 	return (
// 		<Trail
// 			width={1}
// 			length={4}
// 			color={'#F8D628'}
// 			attenuation={t => {
// 				return t * t
// 			}}
// 		>
// 			<points>
// 				<bufferGeometry>
// 					<bufferAttribute attach={'attributes-position'} {...points} />
// 				</bufferGeometry>
// 				<pointsMaterial size={0.1} threshold={0.1} color={0xff00ff} sizeAttenuation={true} />
// 			</points>
// 		</Trail>
// 	)
// }
function BufferPoints() {
	let points = [
		[-1.0, 0.0, 0.0],
		[1.0, 0.0, 0.0],
		[0.5408577919006348, -0.8380453586578369, 0.16345912218093872],
		[-0.0030298233032226562, -0.8978477716445923, 1.1139686107635498],
		[0.6506198048591614, 0.46440255641937256, 1.0185199975967407],
		[0.9651488661766052, 0.38549768924713135, 0.3767693042755127]
	]
	let scale = 1

	for (var i = 0; i < points.length; i++) {
		var x = points[i][0] * scale
		var y = points[i][1] * scale
		var z = points[i][2] * scale
		points[i] = new THREE.Vector3(x, z, -y)
	}

	var curvePath = new THREE.CatmullRomCurve3(points)
	var radius = 0.25

	//========== Create a tube geometry that represents our curve
	var geometry = new THREE.TubeGeometry(curvePath, 600, radius, 10, false)
	//========== Set a different color for each face of the tube. (a triangle represents 1 face in WebGL)
	// for (var i = 0, j = geometry.faces.length; i < j; i++) {
	// geometry.faces[i].color = new THREE.Color('hsl(' + Math.floor(Math.random() * 290) + ',50%,50%)')
	// }
	var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide, transparent: true, opacity: 1 })
	var tube = new THREE.Mesh(geometry, material)

	const positions = new Float32Array([1, 0, 0, 0, 1, 0, -1, 0, 0, 0, -1, 0])

	const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1])

	const colors = new Float32Array([0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1])

	const indices = new Uint16Array([0, 1, 3, 2, 3, 1])

	return (
		<>
			<mesh geometry={geometry} material={material}></mesh>
			{/* <mesh>
				<bufferGeometry>
					<bufferAttribute attach='attributes-position' array={positions} count={positions.length / 3} itemSize={3} />
					<bufferAttribute attach='attributes-color' array={colors} count={colors.length / 3} itemSize={3} />
					<bufferAttribute attach='attributes-normal' array={normals} count={normals.length / 3} itemSize={3} />
					<bufferAttribute attach='index' array={indices} count={indices.length} itemSize={1} />
				</bufferGeometry>
				<meshStandardMaterial vertexColors side={DoubleSide} />
			</mesh> */}
		</>
	)
}

function Scene() {
	const cameraControlsRef = useRef()
	const meshRef = useRef()
	const sphere = useRef()
	const group = useRef()
	const { camera } = useThree()
	const [sceneViewMode, setSceneViewMode] = useState('Restricted')
	useFrame(({ clock }) => {
		const t = clock.getElapsedTime()
		group.current.rotation.z = t
		sphere.current.position.x = Math.sin(t * 2) * 2
		sphere.current.position.z = Math.cos(t * 2) * 2
	})

	// All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html

	return (
		<>
			<group position-y={-1}>
				<group position-y={0.5}>{/* <Shoe /> */}</group>
				<group ref={group}>
					<BufferPoints />

					<Trail
						width={1}
						length={4}
						color={'#F8D628'}
						attenuation={t => {
							return t * t
						}}
					>
						<Sphere ref={sphere} args={[0.1, 32, 32]} position-y={3}>
							<meshNormalMaterial />
						</Sphere>
					</Trail>
				</group>
				<Ground />
				<Shadows />
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
