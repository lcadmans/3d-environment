import { animated, config, useSpring } from '@react-spring/three'
import { Sampler, Text, useGLTF, useAnimations, ComputedAttribute } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useLayoutEffect, useRef, useState, Fragment, useEffect } from 'react'
import { SetsModel } from '../Models/Set'
import { appState } from '../../store'

import useRefs from 'react-use-refs'

import { Arrow } from '../'

import { HirecoLogo } from '../'

import { a } from '@react-spring/three'

import * as THREE from 'three'

import { Vector3, BufferAttribute, StaticReadUsage } from 'three'
import { ContentHolder } from '../'

export function HirecoUniverse(props) {
	return (
		<>
			{/* <UniverseSolid /> */}
			<Universe />
			<UniverseGradient />
			<HirecoLogo />

			{/* <Universe_main /> */}
		</>
	)
}

function UniverseSolid(props) {
	const getUniverseStores = appState(state => state.getUniverseStores)
	const { colorValues } = getUniverseStores()
	const { nodes, materials } = useGLTF('./models/hireco_3DScene_v16.glb')

	const activeRing = appState(state => state.activeRing)
	const currentView = appState(state => state.currentView)

	// console.log(nodes)
	const filteredNodes = Object.values(nodes).filter(node => node.type === 'Mesh')

	return (
		<group {...props} dispose={null}>
			{filteredNodes.map((node, index) => {
				const { translateYActive, pageOpacity } = useSpring({
					translateYActive: activeRing == node.name ? 0.1 : 0,
					pageOpacity: currentView == 'page' ? 0 : 0.1,
					// opacityActive: true ? 1 : 1,
					config: config.gentle
				})

				// console.log(node)
				return (
					<React.Fragment key={'flatGroup' + node.name}>
						<animated.mesh
						// position-y={translateYHidden}
						// key={'randomGroup' + node.name}
						>
							<animated.mesh position-y={translateYActive}>
								<mesh geometry={nodes[node.name].geometry}>
									<a.meshStandardMaterial color={colorValues[5]} opacity={pageOpacity} transparent depthTest={false} blending={THREE.AdditiveBlending} wireframe={true} wireframeLinewidth={0.0001} />
								</mesh>
							</animated.mesh>
						</animated.mesh>
					</React.Fragment>
				)
			})}
			{/* <mesh geometry={nodes.ring_6.geometry} scale={[1, 0.48, 1]}>
				<meshStandardMaterial color={colorValues[5]} opacity={0.1} transparent depthTest={false} blending={THREE.AdditiveBlending} wireframe={true} wireframeLinewidth={0.0001} />
			</mesh> */}

			{/* <mesh geometry={nodes.ring_5.geometry}>
				<meshStandardMaterial color={colorValues[5]} opacity={0.05} transparent depthTest={false} blending={THREE.AdditiveBlending} wireframe={true} wireframeLinewidth={0.0001} />
			</mesh>
			<mesh geometry={nodes.ring_4.geometry}>
				<meshStandardMaterial color={colorValues[5]} opacity={0.025} transparent depthTest={false} blending={THREE.AdditiveBlending} wireframe={true} wireframeLinewidth={0.0001} />
			</mesh>
			<mesh geometry={nodes.ring_3.geometry}>
				<meshStandardMaterial color={colorValues[5]} opacity={0.0125} transparent depthTest={false} blending={THREE.AdditiveBlending} wireframe={true} wireframeLinewidth={0.0001} />
			</mesh>
			<mesh geometry={nodes.ring_2.geometry}>
				<meshStandardMaterial color={colorValues[10]} opacity={0.0075} transparent depthTest={false} blending={THREE.AdditiveBlending} wireframe={true} wireframeLinewidth={0.0001} />
			</mesh> */}

			{/* <mesh geometry={nodes.ring_5.geometry} material={materials['LIGHT BULB.001']} transparrent />
			<mesh geometry={nodes.ring_4.geometry} material={materials['LIGHT BULB.001']} transparrent />
			<mesh geometry={nodes.ring_3.geometry} material={materials['LIGHT BULB.001']} transparrent />
			<mesh geometry={nodes.ring_2.geometry} material={materials['LIGHT BULB.001']} transparrent />
			<mesh geometry={nodes.ring_1.geometry} material={materials['H ORANGE']} transparrent /> */}
		</group>
	)
}

// Transform instances Function

const transformInstances = ({ dummy, sampledMesh, position }) => {
	// const { dummy, position } = args
	// console.log(ringName)

	// sampledMesh.setMatrixAt(100, dummy.matrix)
	dummy.position.copy(position)
	// dummy.position.y += (Math.random() * Math.PI) / 300
	// dummy.position.y = dummy.position.y + Math.random() / 100
	// dummy.position.x = dummy.position.x + Math.random() / 100
	dummy.scale.setScalar(Math.random() * Math.random() * 2)
}
const transformInstancesRandom = ({ dummy, position }) => {
	// const { dummy, position } = args
	// console.log(ringName)

	dummy.position.copy(position)
	dummy.position.y += ((Math.random() / 150) * Math.PI) / 25
	dummy.scale.setScalar(Math.random() * Math.random() * 12)
	// dummy.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
	// dummy.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
}

const Universe = props => {
	// Store
	const focusRing = appState(state => state.focusRing)
	const activeRing = appState(state => state.activeRing)
	const currentView = appState(state => state.currentView)
	const universeStores = appState(state => state.universeStores)
	const getUniverseStores = appState(state => state.getUniverseStores)
	const { colorValues } = getUniverseStores()

	// Refs
	const masterGroup = useRef()
	const randomGroup = useRef()
	const randomMeshRef = useRef()
	const randomInstancesRef = useRef()

	const flatGroup = useRef()

	// THREE Models
	const { nodes: flatNodes, materials: flatMaterials } = useGLTF('./models/hireco_3DScene_v16.glb')
	const { nodes: randomNodes, materials: randomMaterials } = useGLTF('./models/universe/hireco_3DScene_ringR-v1-forGLTF.glb')

	const { nodes, materials } = useGLTF('./models/universe/hireco_3DScene_ringRAndO-v1-forGLTF.glb')

	const randomNodesProcessed = Object.values(randomNodes).filter(a => a.type == 'Mesh')
	// const outwardNodesProcessed = Object.values(outwardNodes).filter(a => a.type == 'Mesh')
	const flatNodesProcessed = Object.values(flatNodes).filter(a => a.type == 'Mesh')
	randomNodesProcessed.forEach(a => {
		a.name = a.name.split('-')[0]
	})

	// console.log(randomNodesProcessed)

	const config = {
		opacity: 0,
		depthTest: false
	}

	useFrame(state => {
		// const t = state.clock.getElapsedTime()
		// masterGroup.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 30)
		// universeMeshGroup.current.position.y = ((1 + Math.sin(t / 1.5)) / 80) * multiplier
		// universeMeshGroup.current.position.y = ((1 + Math.sin(t / 1.5)) / 80) * multiplier
		// samplerRefGroup.current.scale.y = 1 + ((1 + Math.sin(t / 1.5)) / 80) * multiplier
		// ringsGroup.current.rotation.y += rotationAmount
	})

	return (
		<>
			<group ref={masterGroup}>
				<group ref={randomGroup}>
					{randomNodesProcessed.map((ring, index) => {
						const ringRef = useRef()
						const ringsGroup = useRef()
						const ringInstanceRef = useRef()
						let { name: ringName } = ring
						// ringName = ringName.

						if (ringName == 'ring_1') return <></>

						let multiplier = 20

						useFrame(state => {
							const t = state.clock.getElapsedTime()
							// universeMeshGroup.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 30)
							// ringInstanceRef.current.position.y = (1 + Math.sin(t / 1.5)) / 400
							// ringInstanceRef.current.scale.y = 1 + ((1 + Math.sin(t / 1.5)) / 60) * multiplier
							// ringsGroup.current.rotation.y += rotationAmount
							ringsGroup.current.scale.y = 0.8 + ((1 + Math.sin(t / 2)) / 90) * multiplier
						})

						// let sampleAmount = 10000 - index * 2000
						let sampleAmount = 10000 - index * 2000

						let col = new THREE.Color(...colorValues[3])

						const { translateYActiveRing, emissiveIntensity } = useSpring({
							translateYActiveRing: activeRing == ringName ? 0.1 : 0,
							emissiveIntensity: currentView == 'focus' || currentView == 'page' ? 0 : 2,
							translateYHidden: currentView == 'focus' && activeRing != ringName ? 0 : 0,
							opacityActive: true ? 1 : 1,
							config: config.gentle
						})

						return (
							<React.Fragment key={'randomGroup' + ringName}>
								<animated.mesh
								// position-y={translateYHidden}
								// key={'randomGroup' + ringName}
								>
									<animated.mesh position-y={translateYActiveRing}>
										<group ref={ringsGroup}>
											<Sampler count={sampleAmount} mesh={ringRef} instances={ringInstanceRef} transform={transformInstancesRandom} />
											<instancedMesh args={[null, null, sampleAmount]} ref={ringInstanceRef}>
												<sphereGeometry args={[0.00005, 1, 1]} />
												{/* <a.meshBasicMaterial color={new THREE.InstancedBufferAttribute(...colorValues[9], 1000, false, 2)} emissiveIntensity={1} toneMapped={false} position={[0, 1, 0]}></a.meshBasicMaterial> */}
												<a.meshStandardMaterial transparent alpha={true} opacity={1} emissive={col} emissiveIntensity={emissiveIntensity} color={col} toneMapped={false}></a.meshStandardMaterial>
												{/* <a.meshStandardMaterial color={colorValues[9]} emissiveIntensity={1} toneMapped={false} position={[0, 1, 0]}></a.meshStandardMaterial> */}
											</instancedMesh>
											<mesh geometry={randomNodes[ringName + '-r'].geometry} ref={ringRef}>
												<meshPhysicalMaterial transparent {...config} />
											</mesh>
										</group>
									</animated.mesh>
								</animated.mesh>
							</React.Fragment>
						)
					})}
				</group>

				<group ref={flatGroup}>
					{flatNodesProcessed.map((ring, index) => {
						const ringRef = useRef()
						const ringInstanceRef = useRef()
						const { name: ringName } = ring

						if (ringName == 'ring_1') return <></>

						const focusRing = appState(state => state.focusRing)
						const activeRing = appState(state => state.activeRing)

						const { translateYActive, emissiveIntensity, ringOpacity } = useSpring({
							translateYActive: activeRing == ringName ? 0.1 : 0,
							translateYHidden: currentView == 'focus' && activeRing != ringName ? 0 : 0,
							emissiveIntensity: currentView == 'focus' || currentView == 'page' ? 0 : 2,
							ringOpacity: currentView != 'page' || (currentView == 'page' && activeRing == ringName) ? 1 : 0,
							config: config.gentle
						})

						let sampleAmount = 24000 - index * 5600
						let ringSize = 0.0004
						if (ringName == 'ring_6') {
							sampleAmount = sampleAmount + 15000
							ringSize = 0.0008
						}
						if (ringName == 'ring_5') {
							sampleAmount = sampleAmount + 5000
							ringSize = 0.0006
						}
						if (ringName == 'ring_4') {
							sampleAmount = sampleAmount + 3000
							ringSize = 0.0004
						}

						// if (ringName != 'ring_6') return <></>

						let col = new THREE.Color(...colorValues[3])

						return (
							<animated.mesh
								//  position-y={translateYHidden}
								key={'flatGroupMesh' + ringName}
							>
								<animated.mesh position-y={translateYActive}>
									<TextSections nodeName={ringName} index={index} />
									<Sampler count={sampleAmount} mesh={ringRef} instances={ringInstanceRef} transform={transformInstances} />
									<instancedMesh args={[null, null, sampleAmount]} ref={ringInstanceRef}>
										<sphereGeometry args={[ringSize, 1, 1]} />
										<a.meshStandardMaterial transparent alpha={true} opacity={ringOpacity} emissive={col} emissiveIntensity={emissiveIntensity} color={col} toneMapped={false}></a.meshStandardMaterial>
										{/* <meshBasicMaterial color={colorValues[9]} emissiveIntensity={1} toneMapped={false} position={[0, 1, 0]}></meshBasicMaterial> */}
									</instancedMesh>
									<mesh geometry={flatNodes[ringName].geometry} ref={ringRef}>
										<meshPhysicalMaterial transparent {...config} />
									</mesh>
								</animated.mesh>
							</animated.mesh>
						)
					})}
				</group>
			</group>
		</>
	)
}

function TextSections(props) {
	const { index, nodeName, rotationAmount } = props
	if (nodeName.includes('H_') || nodeName == 'ring_1') return null

	const getUniverseStores = appState(state => state.getUniverseStores)
	const { sectionPositions } = getUniverseStores()
	const position = sectionPositions[nodeName]

	// State
	const setFocusRing = appState(state => state.setFocusRing)
	const focusRing = appState(state => state.focusRing)
	const activeRing = appState(state => state.activeRing)
	const setActiveRing = appState(state => state.setActiveRing)
	const currentView = appState(state => state.currentView)
	const setCurrentView = appState(state => state.setCurrentView)
	const setUniverseStores = appState(state => state.setUniverseStores)
	const universeStores = appState(state => state.universeStores)

	useEffect(() => {
		setUniverseStores(getUniverseStores())
	}, [])

	const textContentRef = useRef()
	const textGroupRef = useRef()

	const [baseScale, setBaseScale] = useState(fetchScale(index))

	const { iconScale, initialTextScale, focusTextScale } = useSpring({
		iconScale: focusRing == nodeName ? baseScale * 1.25 : baseScale,
		initialTextScale: currentView == 'focus' ? 0 : 1,
		focusTextScale: currentView == 'focus' ? 1 : 0,
		config: config.gentle
	})

	if (nodeName == 'ring_1') return <></>

	let copy = {
		ring_6: { title: 'WELFARE', subTitle: 'ENVIRONMENT + PARK' },
		ring_5: { title: 'TECHNOLOGY', subTitle: 'SMART + ASSET' },
		ring_4: { title: 'SUPPORT', subTitle: 'MAINTAIN + FINANCE' },
		ring_3: { title: 'SOURCE', subTitle: 'ASSETS + FINANCE' },
		ring_2: { title: 'EXPERTS', subTitle: 'THE TEAM' }
	}

	useFrame(({ camera }) => {
		if (!textContentRef.current) return
		textContentRef.current.quaternion.copy(camera.quaternion)
		textContentRef.current.lookAt(camera.position)
	})

	useLayoutEffect(() => {
		// textContentRef.current.position.y = textContentRef.current.position.y + 0.05
	}, [])

	function fetchScale(index) {
		let scale = 0.3
		index = index + 3
		scale = scale / index

		return scale
	}

	function handleMouseOver() {
		setFocusRing(nodeName)
	}

	function handleMouseOut() {
		setFocusRing('none')
	}

	const { iconScalar, groupPositionY, iconElevationActive, iconPageScaler } = useSpring({
		iconScalar: activeRing == nodeName ? 1.2 : 0.8,
		groupPositionY: activeRing == nodeName ? 0.1 : 0,
		translateYHidden: currentView == 'focus' && activeRing != nodeName ? -0.05 : 0,
		iconElevationActive: activeRing == nodeName ? 0.1 : 0.05,
		iconPageScaler: currentView == 'page' ? 0.33 : 1,
		config: config.gentle
	})

	const setIsAnimating = appState(state => state.setIsAnimating)

	return (
		<>
			<animated.mesh position-y={iconElevationActive}>
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
					// onClick={() => {
					// 	setActiveRing(nodeName)
					// 	setCurrentView('focus')
					// }}
					position-y={0.02}
				>
					{/* <animated.mesh position-y={groupPositionY}> */}
					<group visible={(currentView != 'page' && currentView != 'focus') || (currentView == 'focus' && activeRing == nodeName)}>
						<animated.mesh scale={initialTextScale}>
							<group position={[0, 0.25 / (index + 3), 0]}>
								<Text font={'./fonts/Eveleth Clean Thin.otf'} anchorX='center' anchorY='middle' position={position} fontSize={0} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.025} color={0xffffff} opacity={2}></Text>
								<Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='center' anchorY='middle' position={position} fontSize={[0.035, 0.03, 0.025, 0.02, 0.02, 0.015][index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.025} opacity={2} ref={textContentRef} color={0xffffff}>
									{copy[nodeName].title}
								</Text>
							</group>
						</animated.mesh>
						<animated.mesh scale={focusTextScale} position={position}>
							<group position={[0.125, 0.015, 0]}>
								<group position={[-0.01, 0.02, 0]}>
									<Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='left' anchorY='middle' fontSize={[0.06, 0.05, 0.04, 0.035, 0.03, 0.025][index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.0075} color={[1, 3, 0]}>
										{copy[nodeName].title}
									</Text>
								</group>
								<group position={[0, -0.025, 0]}>
									<Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='left' anchorY='middle' fontSize={[0.03, 0.025, 0.02, 0.02, 0.02, 0.015][index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.0075} color={[1, 3, 0]}>
										{copy[nodeName].subTitle}
									</Text>
								</group>
								<group
									scale={0.05}
									position={[0.2, -0.1, 0]}
									onClick={() => {
										// setActiveRing('pageSection')
										setCurrentView('page')
										setIsAnimating(true)
									}}
									scale-x={0.1}
								>
									<Arrow />
								</group>
								{/* <group
								scale={0.05}
								position={[-0.2, -0.05, 0]}
								// rotateOnAxis={100}
								// axis={new THREE.Vector3(0, 1, 0)}
								rotation-y={180}
								onClick={() => {
									setActiveRing('pageSection')
									setCurrentView('page')
									setIsAnimating(true)
								}}
								ref={backArrow}
							>
								<Arrow />
							</group> */}
							</group>
						</animated.mesh>
					</group>

					<group
					// visible={(currentView == 'focus' && activeRing == nodeName) || (currentView == 'page' && activeRing == nodeName) || currentView == 'main'}
					>
						<animated.mesh
							scale={iconScale}
							position={position}
							onClick={() => {
								setActiveRing(nodeName)
								setCurrentView('page')
								// setCurrentView('focus')
							}}
						>
							<group>
								<animated.mesh scale={iconPageScaler}>
									<animated.mesh scale={iconScalar}>
										<SetsModel position={position} index={index} nodeName={nodeName} />
									</animated.mesh>
								</animated.mesh>
							</group>
						</animated.mesh>
					</group>
					{/* <group visible={currentView == 'page' && activeRing == nodeName} position={position}>
						<ContentHolder />
					</group> */}
					{/* </animated.mesh> */}
				</group>
			</animated.mesh>
		</>
	)
}

function UniverseGradient(props) {
	const { nodes, materials } = useGLTF('./models/universe/universe_gradient.glb')
	return (
		<group {...props} dispose={null}>
			<mesh castShadow receiveShadow geometry={nodes.ring_6_s.geometry} material={materials['RING.006']} />
			<mesh castShadow receiveShadow geometry={nodes.ring_5_s.geometry} material={materials['RING.006']} />
			<mesh castShadow receiveShadow geometry={nodes.ring_3_s.geometry} material={materials.RINGS} />
			<mesh castShadow receiveShadow geometry={nodes.ring_4_s.geometry} material={materials['RINGS.002']} />
			<mesh castShadow receiveShadow geometry={nodes.ring_2_s.geometry} material={materials['RINGS.001']} />
		</group>
	)
}

useGLTF.preload('./models/universe/universe_gradient.glb')
useGLTF.preload('./models/hireco_3DScene_v16.glb')
useGLTF.preload('./models/universe/hireco_3DScene_ringR-v1-forGLTF.glb')
// useGLTF.preload('./models/hireco_3DScene_beveled-v4.glb')
useGLTF.preload('./models/universe/hireco_3DScene_ringRAndO-v1-forGLTF.glb')
useGLTF.preload('./models/hireco_3DScene_sectLocation-v1.glb')
