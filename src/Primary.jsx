// import React, { useRef, useState } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { Model } from './Models/Model'

import { AccumulativeShadows, Grid, RandomizedLight, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { memo, useMemo, useRef } from 'react'

import { proxy } from 'valtio'

import * as THREE from 'three'
import { BufferAttribute } from 'three'

import fragmentShader from './shaders/fragmentShader'
import vertexShader from './shaders/vertexShader'

import { appState } from './store/store'

// const { DEG2RAD } = THREE.MathUtils

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

export default function Primary() {
	return (
		<>
			<Scene />
		</>
	)
}

function BufferPoints({ count = 1000 }) {
	const points = useMemo(() => {
		const p = new Array(count).fill(0).map(v => (0.5 - Math.random()) * 3.5)
		return new BufferAttribute(new Float32Array(p), 4)
	}, [count])

	return (
		<points>
			<bufferGeometry>
				<bufferAttribute attach={'attributes-position'} {...points} />
			</bufferGeometry>
			<pointsMaterial size={0.1} threshold={0.1} color={0xeb8913} sizeAttenuation={true} />
		</points>
	)
}

const CustomGeometryParticles = props => {
	const { count } = props
	const radius = 2

	// This reference gives us direct access to our points
	const points = useRef()

	// Generate our positions attributes array
	const particlesPosition = useMemo(() => {
		const positions = new Float32Array(count * 3)

		for (let i = 0; i < count; i++) {
			const distance = Math.sqrt(Math.random() - 0.5) * radius
			const theta = THREE.MathUtils.randFloatSpread(360)
			const phi = THREE.MathUtils.randFloatSpread(360)

			let x = distance * Math.sin(theta) * Math.cos(phi)
			let y = distance * Math.sin(theta) * Math.sin(phi)
			let z = distance * Math.cos(theta)

			positions.set([x, y, z], i * 3)
		}

		return positions
	}, [count])

	const uniforms = useMemo(
		() => ({
			uTime: {
				value: 0.0
			},
			uRadius: {
				value: radius
			}
		}),
		[]
	)

	useFrame(state => {
		const { clock } = state

		points.current.material.uniforms.uTime.value = clock.elapsedTime
	})

	return (
		<points ref={points}>
			<bufferGeometry>
				<bufferAttribute attach='attributes-position' count={particlesPosition.length / 3} array={particlesPosition} itemSize={3} />
			</bufferGeometry>
			<shaderMaterial depthWrite={false} fragmentShader={fragmentShader} vertexShader={vertexShader} uniforms={uniforms} />
		</points>
	)
}

export function Spheres(props) {
	let sphereOneRef = useRef()
	let sphereTwoRef = useRef()
	let sphereThreeRef = useRef()
	let sphereFourRef = useRef()
	let sphereFiveRef = useRef()

	const activeSlide = appState(state => state.activeSlide)
	const selectSlide = appState(state => state.setActiveSlide)
	console.log(activeSlide)

	const { nodes, materials } = useGLTF('./public/hireco/hireco-spheres-v1.glb')
	return (
		<group {...props} dispose={null}>
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_2_Sphere.geometry} material={materials['H ORANGE']} position={[0.06, 0, 0.01]} scale={0.01} />
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_3_Sphere.geometry} material={materials['H ORANGE']} position={[-0.04, 0, 0.12]} scale={0.01} />
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_4_Sphere.geometry} material={materials['H ORANGE']} position={[-0.17, 0, -0.16]} scale={0.01} />
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_5_Sphere.geometry} material={materials['H ORANGE']} position={[0.38, 0, -0.04]} scale={0.01} />
			<mesh
				ref={sphereFiveRef}
				index={1}
				onClick={e => {
					selectSlide(sphereFiveRef.current.index)
				}}
				castShadow
				receiveShadow
				geometry={nodes.ringArrow_6_Sphere.geometry}
				material={materials['H ORANGE']}
				position={[-0.61, 0, 0.33]}
				scale={0.01}
			/>
		</group>
	)
}

function Scene() {
	const bufferBgRef = useRef()

	useFrame(state => {
		const t = state.clock.getElapsedTime()
		bufferBgRef.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
		bufferBgRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10
	})

	return (
		<>
			<group
			// position-y={-1}
			>
				<group
				// position-y={0.5}
				>
					{/* <Shoe /> */}
					<HirecoUniverse />
					<Spheres />
				</group>
				{/* <Ground /> */}
				{/* <Shadows /> */}
				<group ref={bufferBgRef}>
					<BufferPoints />
				</group>
				<CustomGeometryParticles count={4000} />
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

const HirecoUniverse = props => {
	const { nodes, materials } = useGLTF('./hireco/hireco_3DScene_v1.glb')
	return (
		<group {...props} dispose={null}>
			{/* <mesh castShadow receiveShadow geometry={nodes.ringArrow_5_sphere.geometry} material={materials['H ORANGE']} position={[0.38, 0, -0.04]} scale={[0.01, 0, 0.01]} /> */}
			{/* <mesh castShadow receiveShadow geometry={nodes.ringArrow_4_sphere.geometry} material={materials['H ORANGE']} position={[-0.17, 0, -0.15]} scale={0} /> */}
			{/* <mesh castShadow receiveShadow geometry={nodes.ringArrow_3_sphere.geometry} material={materials['H ORANGE']} position={[-0.04, 0, 0.13]} scale={0} /> */}
			{/* <mesh castShadow receiveShadow geometry={nodes.ringArrow_2_sphere.geometry} material={materials['H ORANGE']} position={[0.06, 0, 0.01]} scale={0} /> */}
			{/* <mesh castShadow receiveShadow geometry={nodes.ringArrow_6_sphere.geometry} material={materials['H ORANGE']} position={[-0.62, 0, 0.32]} scale={0.01} /> */}
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_3.geometry} material={materials.RINGS} scale={14} />
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_4.geometry} material={materials.RINGS} scale={14} />
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_6.geometry} material={materials.RINGS} scale={14} />
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_2.geometry} material={materials.RINGS} scale={14} />
			<mesh castShadow receiveShadow geometry={nodes.hirecoH_1001.geometry} material={materials['H ORANGE']} scale={14} />
			<mesh castShadow receiveShadow geometry={nodes.hirecoH_1.geometry} material={materials['H ORANGE']} scale={14} />
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_1.geometry} material={materials.RINGS} scale={14} />
			<mesh castShadow receiveShadow geometry={nodes.ringArrow_5.geometry} material={materials.RINGS} rotation={[-Math.PI, 0.36, -Math.PI]} scale={7.85} />
		</group>
	)
}

useGLTF.preload('./hireco/hireco_3DScene_v1.glb')
useGLTF.preload('/hireco-spheres-v1.glb')
