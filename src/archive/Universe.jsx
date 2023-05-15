import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SetsModel } from '../Models/Set'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, Sampler, Sphere, Text, shaderMaterial, Plane } from '@react-three/drei'
import { BufferAttribute, Object3D, BufferGeometry, StaticReadUsage, Vector3, CylinderGeometry, Color, MeshStandardMaterial } from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import { useSpring, animated, config } from '@react-spring/three'
import { a } from '@react-spring/three'

import Perlin from 'perlin.js'

import * as THREE from 'three'

import { SelectiveBloom } from '@react-three/postprocessing'
import { BlurPass, Resizer, KernelSize } from 'postprocessing'

import { EffectComposer } from '@react-three/postprocessing'
import { appState } from '../store'

export function HirecoUniverse(props) {
	return (
		<>
			<Universe_main />
			{/* <Universe_extra /> */}
			{/* <Universe_extra pulseSpeed={10} scaleMultiplier={2} /> */}
			{/* <Universe_random /> */}
		</>
	)
}

function Universe_extra(props) {
	const { pulseSpeed, scaleMultiplier } = props
	const { nodes, materials } = useGLTF('./models/hireco_3DScene_beveled-v4.glb')

	let allNodes = Object.values(nodes)
	let allNodesMesh = allNodes.filter(a => a.type === 'Mesh' && a.name.indexOf('ring_') > -1) // a.name.indexOf('ring') > -1)
	// console.log(allNodesMesh)

	const masterRef = useRef()

	useFrame(state => {
		// const t = state.clock.getElapsedTime()
		// masterRef.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 20)
		// masterRef.current.position.y = (1 + Math.sin(t / 1.5)) / 80
	})

	return (
		<>
			{allNodesMesh.map((a, index) => {
				if (!a.geometry) return null

				return (
					<group {...props} dispose={null} ref={masterRef} key={a.name}>
						<UniverseMesh node={a} index={index} isBevel={true} pulseSpeed={pulseSpeed} scaleMultiplier={scaleMultiplier} />
					</group>
				)
			})}
		</>
	)
}
function Universe_random(props) {
	const { nodes, materials } = useGLTF('./models/universe/hireco_3DScene_random-v1.glb')

	let allNodes = Object.values(nodes)
	let allNodesMesh = allNodes.filter(a => a.type === 'Mesh' && a.name.indexOf('ring_') > -1) // a.name.indexOf('ring') > -1)
	// console.log(allNodesMesh)

	const masterRef = useRef()

	useFrame(state => {
		// const t = state.clock.getElapsedTime()
		// masterRef.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 20)
		// masterRef.current.position.y = (1 + Math.sin(t / 1.5)) / 80
	})

	return (
		<>
			{allNodesMesh.map((a, index) => {
				if (!a.geometry) return null

				return (
					<group {...props} dispose={null} ref={masterRef} key={a.name}>
						<UniverseMesh node={a} index={index} isBevel={true} />
					</group>
				)
			})}
		</>
	)
}

const fetchNodes = () => {
	const { nodes, materials } = useGLTF('./models/hireco_3DScene_sectLocation-v1.glb')

	let sectPositions = {}
	// console.log(nodes)

	Object.keys(nodes).forEach(a => {
		let b = nodes[a]
		if (b.type == 'Mesh') sectPositions[b.name] = b.position
	})

	return sectPositions
}

function Universe_main(props) {
	const { nodes, materials } = useGLTF('./models/hireco_3DScene_v18.glb')

	let allNodes = Object.values(nodes)

	let allNodesMesh = allNodes.filter(a => a.type === 'Mesh' && a.name.indexOf('ring_') > -1) // a.name.indexOf('ring') > -1)

	const masterRef = useRef()

	return (
		<>
			{allNodesMesh.map((a, index) => {
				if (!a.geometry) return null
				// if (a.name == 'ring_1') return null
				// if (a.name != 'ring_2') return null

				return (
					<group {...props} dispose={null} ref={masterRef} key={a.name}>
						<UniverseMesh node={a} index={index} />
					</group>
				)
			})}
		</>
	)
}

function UniverseMesh(props) {
	let { node, index, isBevel = false, pulseSpeed, scaleMultiplier } = props

	const universeMeshGroup = useRef()
	const instancedMesh = useRef()
	const ringMesh = useRef()
	const ringsGroup = useRef()
	const samplerRef = useRef()
	const sectionRef = useRef()
	const samplerRefGroup = useRef()

	const sectionPositions = fetchNodes()

	// console.log(node.name)
	// if (node.name.slice(-1) == 'b') {
	// 	// console.log('isBevel')
	// 	setIsBevel(true)
	// 	node.name = node.name.slice(0, -2)
	// }

	function nonBevelBaseParticleCount(index) {
		let samples = 10000 - index * 2300
		return samples
	}
	function bevelParticleCount(index) {
		return 5000 - index * 1000
	}

	let samples = isBevel ? bevelParticleCount(index) : nonBevelBaseParticleCount(index)

	// if (index == 6 || index == 5 || index == 4 || index == 3) samples = index * 1000

	// let samples = isBevel ? 100 : 10000

	// index manipulation
	let rotationAmount = index + 1
	if (rotationAmount % 2 == 0) {
		rotationAmount = rotationAmount * -1.5
	}

	rotationAmount = rotationAmount / 10000

	let multiplier = 1
	let bevelScale = 1
	let samplerScale = 1.05
	if (isBevel) {
		multiplier = 30
		bevelScale = 1.05
		samplerScale = 1.04
	}
	if (pulseSpeed) multiplier = pulseSpeed

	useFrame(state => {
		const t = state.clock.getElapsedTime()
		universeMeshGroup.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 30)
		// universeMeshGroup.current.position.y = ((1 + Math.sin(t / 1.5)) / 80) * multiplier
		// universeMeshGroup.current.position.y = ((1 + Math.sin(t / 1.5)) / 80) * multiplier
		samplerRefGroup.current.scale.y = 1 + ((1 + Math.sin(t / 1.5)) / 80) * multiplier
		ringsGroup.current.rotation.y += rotationAmount
	})

	let colorValues = []
	let baseValues = [0.831, 0.25, 0.007]
	for (let i = 0; i < 10; i++) {
		let row = []
		row.push(baseValues[0] * i)
		row.push(baseValues[1] * i)
		row.push(baseValues[2] * i)
		colorValues.push(row)
	}

	const activeRing = appState(state => state.activeRing)
	const setActiveRing = appState(state => state.setActiveRing)

	const focusRing = appState(state => state.focusRing)

	const { translateYFocus, translateYActive, translateYHidden, planeOpacity } = useSpring({
		translateYFocus: focusRing == node.name ? 0.005 : -0.005,
		config: config.gentle,
		translateYActive: activeRing == node.name ? 0.005 : 0,
		translateYHidden: activeRing != 'none' && activeRing != node.name ? -0.05 : 0,
		planeOpacity: activeRing != 'none' ? 0 : 0,
		particleAmount: focusRing == node.name ? 100 : 10000
	})

	// console.log('translateY')
	// console.log(translateY)
	const sphereGeometry = useRef()
	const meshRef = useRef()

	function lerp(x, y, a) {
		const r = (1 - a) * x + a * y
		return Math.abs(x - y) < 0.001 ? y : r
	}

	const { spring } = useSpring({
		spring: focusRing == node.name,
		config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 }
	})

	let sampleRefSize = 0.00025
	if (scaleMultiplier) {
		sampleRefSize = sampleRefSize * scaleMultiplier
	}
	function transformPoint() {}

	return (
		<>
			<animated.mesh position-y={translateYHidden}>
				<animated.mesh position-y={translateYActive}>
					<group ref={universeMeshGroup}>
						<animated.mesh position-y={translateYFocus}>
							<group dispose={null} ref={ringsGroup}>
								{isBevel ? <></> : <>{<TextSections nodeName={node.name} index={index} position={sectionPositions[node.name]} />}</>}

								<group ref={samplerRefGroup}>
									<Sampler count={samples} ref={samplerRef} scale={samplerScale}>
										<mesh geometry={node.geometry} ref={ringMesh}>
											<meshPhongMaterial color='#000000' opacity={0} transparent />
										</mesh>
										<instancedMesh args={[0, 0, 10000]} ref={instancedMesh}>
											<sphereGeometry args={[0.0002, 4, 4]} position={[0, 1, 0]} />
											<meshBasicMaterial color={colorValues[9]} emissiveIntensity={2} toneMapped={false} position={[0, 1, 0]}></meshBasicMaterial>
										</instancedMesh>
									</Sampler>
								</group>
							</group>
						</animated.mesh>
					</group>
				</animated.mesh>
			</animated.mesh>
			{/* <Plane args={[1, 1]} rotation={[-45, 0, 0]} /> */}
			{/* <mesh rotation={[-1.7, 0.2, 0]}>
				<planeBufferGeometry attach='geometry' args={[15, 15]} />
				<a.meshPhongMaterial attach='material' color='black' transparent opacity={planeOpacity} />
			</mesh> */}
		</>
	)
}

function TextSections({ index, nodeName, rotationAmount, position }) {
	const setFocusRing = appState(state => state.setFocusRing)
	const focusRing = appState(state => state.focusRing)

	const activeRing = appState(state => state.activeRing)
	const setActiveRing = appState(state => state.setActiveRing)

	if (nodeName == 'ring_1') return <></>

	let copy = {
		ring_6: { title: 'WELFARE', subTitle: 'ENVIRONMENT + PARK' },
		ring_5: { title: 'TECHNOLOGY', subTitle: 'SMART + ASSET' },
		ring_4: { title: 'SUPPORT', subTitle: 'MAINTAIN + FINANCE' },
		ring_3: { title: 'SOURCE', subTitle: 'ASSETS + FINANCE' },
		ring_2: { title: 'EXPERTS', subTitle: 'THE TEAM' }
	}

	const textContentRef = useRef()
	const textGroupRef = useRef()

	useFrame(({ camera }) => {
		textContentRef.current.quaternion.copy(camera.quaternion)
		textContentRef.current.lookAt(camera.position)
	})

	useLayoutEffect(() => {
		// textContentRef.current.position.y = textContentRef.current.position.y + 0.05
	}, [])

	const [active, setActive] = useState(false)
	const [baseScale, setBaseScale] = useState(fetchScale(index))
	const { iconScale } = useSpring({ iconScale: focusRing == nodeName ? baseScale * 1.5 : baseScale, config: config.gentle })

	function handleMouseOver() {
		// setActive(true)
		setFocusRing(nodeName)
	}

	function handleMouseOut() {
		// setActive(false)
		setFocusRing('none')
	}
	// function setOpacity(obj, opacity) {
	// 	obj.children.forEach(child => {
	// 		setOpacity(child, opacity)
	// 	})
	// 	if (obj.material) {
	// 		obj.material.opacity = opacity
	// 	}
	// }

	// useLayoutEffect(() => {
	// 	setOpacity(textGroupRef.current, 0)
	// }, [])

	return (
		<>
			<group
				ref={textGroupRef}
				onPointerOver={() => {
					handleMouseOver()
					document.body.style.cursor = 'pointer'
				}}
				onPointerOut={() => {
					// setScale(fetchScale(index))
					handleMouseOut()
					document.body.style.cursor = 'default'
				}}
				onClick={() => setActiveRing(nodeName)}
			>
				<group position={[0, 0.1, 0]}>
					<Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='center' anchorY='middle' position={position} fontSize={[0.03, 0.025, 0.02, 0.02, 0.02, 0.015][index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.0075} ref={textContentRef} color={[1, 3, 0]}>
						{copy[nodeName].title}
					</Text>
				</group>
				<animated.mesh scale={iconScale} position={position}>
					<group>
						<SetsModel position={position} index={index} nodeName={nodeName} />
					</group>
				</animated.mesh>
			</group>
		</>
	)
}

function fetchScale(index) {
	let scale = 0.4
	index = index + 4
	scale = scale / index

	return scale
}

useGLTF.preload('./models/universe/hireco_3DScene_random-v1.glb')
useGLTF.preload('./models/hireco_3DScene_sectLocation-v1.glb')
useGLTF.preload('./models/hireco_3DScene_v18.glb')
useGLTF.preload('./models/hireco_3DScene_beveled-v4.glb')
