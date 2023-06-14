import { animated, config, useSpring } from '@react-spring/three'
import { shallow } from 'zustand/shallow'
import { Center, Html, Line, Plane, Sampler, Text, useGLTF, useVideoTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { appState } from '../../store'
import { SetsModel } from '../Models/Set'

import { HirecoLogo } from '../'

import { a } from '@react-spring/three'

import * as THREE from 'three'

export function HirecoUniverse(props) {
	const testRef = useRef()

	const currentView = appState(state => state.currentView)

	const getUniverseStores = appState(state => state.getUniverseStores)
	const { colorValues } = getUniverseStores()
	let col = new THREE.Color([0.831, 0.25, 0.007])
	// console.log(col)

	return (
		<>
			<UniverseContent />
			<UniverseGradient />
			<group visible={currentView == 'HirecoCenter'}>
				<Screen src={'./videos/221211 - Hireco 2022 - v7.mp4'} />
			</group>
			<HirecoLogo />

			<Html
				// 3D-transform contents
				prepend
				transform
				// Hide contents "behind" other meshes
				// occlude
				// Tells us when contents are occluded (or not)
				// onOcclude={setOccluded}
				// We just interpolate the visible state into css opacity and transforms
				// style={{ opacity: activeTile == id ? 1 : 0, transform: `scale(${activeTile == id ? 1 : 0.25})`, pointerEvents: 'none' }}
				// {...props}
			>
				{/* <video width='400'>
					<source src='./videos/221211 - Hireco 2022 - v7.mp4' type='video/mp4' />
					Your browser does not support HTML video.
				</video> */}

				{/* <p className={'text-[100px]'}>Test</p> */}
			</Html>
		</>
	)
}

function Screen({ src }) {
	const [video, setVideo] = useState()
	return (
		<Center top position-z={0} position-y={20}>
			<Plane width={1280} height={1080} radius={2} args={[50, 50]}>
				<Suspense fallback={<meshStandardMaterial side={THREE.DoubleSide} wireframe />}>
					<VideoMaterial src={src} setVideo={setVideo} />
				</Suspense>
			</Plane>
		</Center>
	)
}

function VideoMaterial({ src, setVideo }) {
	const texture = useVideoTexture(src, { start: true })
	// texture.wrapS = THREE.RepeatWrapping
	// texture.wrapT = THREE.RepeatWrapping
	// texture.repeat.x = -1
	// texture.offset.x = 1
	setVideo(texture.image)

	return <meshStandardMaterial map={texture} />
}

const transformInstancesRandom = ({ dummy, position }) => {
	// const { dummy, position } = args
	// console.log(ringName)

	dummy.position.copy(position)
	dummy.position.y += ((Math.random() / 150) * Math.PI) / 25
	dummy.scale.setScalar(Math.random() * Math.random() * 13)
}

const UniverseContent = props => {
	// Store
	const currentView = appState(state => state.currentView)
	const getUniverseStores = appState(state => state.getUniverseStores)

	// Refs
	const masterGroup = useRef()
	const flatGroup = useRef()

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
				<group ref={flatGroup}>
					{['ring_6', 'ring_5', 'ring_4', 'ring_3', 'ring_2', 'ring_1'].map((ringName, index) => {
						const ringRef = useRef()
						const ringInstanceRef = useRef()
						// const { name: ringName } = ring

						// console.log(ring)

						if (ringName == 'ring_1') return <></>

						const focusRing = appState(state => state.focusRing)
						const activeRing = appState(state => state.activeRing)

						const { translateYActive, emissiveIntensity, ringOpacity } = useSpring({
							translateYActive: activeRing == ringName ? 0 : 0,
							translateYHidden: currentView == 'focus' && activeRing != ringName ? 0 : 0,
							emissiveIntensity: currentView == 'focus' || currentView == 'page' ? 0 : 2,
							ringOpacity: currentView != 'page' || (currentView == 'page' && activeRing == ringName) ? 1 : 0,
							config: config.gentle
						})

						return (
							<>
								<SectionCopy ring={ringName} index={index} />
								<animated.mesh
									//  position-y={translateYHidden}
									key={'flatGroupMesh' + ringName}
								>
									<animated.mesh position-y={translateYActive}>
										<TextSection nodeName={ringName} index={index} />
									</animated.mesh>
								</animated.mesh>
							</>
						)
					})}
				</group>
			</group>
		</>
	)
}

function SectionCopy(props) {
	const { ring, index } = props

	const activeTile = appState(state => state.activeTile, shallow)
	const activeRing = appState(state => state.activeRing, shallow)
	const ringNames = appState(state => state.ringNames)
	const fetchData = appState(state => state.fetchData)
	const getUniverseStores = appState(state => state.getUniverseStores)
	const { sectionPositions } = getUniverseStores()
	const position = sectionPositions[ring]

	const groupRef = useRef()

	useFrame(({ camera }) => {
		// if (!textContentRef.current) return
		// textContentRef.current.quaternion.copy(camera.quaternion)
		// groupRef.current.lookAt(camera.position)
	})

	const ringName = ringNames[ring]
	const sectionCopy = fetchData.filter(item => item.section == 'Sectioncopy').filter(item => item.ring == ringName)

	// console.log('sectionCopy')
	// console.log(sectionCopy)

	let title, description, image, otherImages, subtitle

	title = ''

	if (sectionCopy.length > 0) {
		title = sectionCopy[0].title
		description = sectionCopy[0].description
		image = sectionCopy[0].image
		otherImages = sectionCopy[0].otherImages
		subtitle = sectionCopy[0].subtitle
	}

	return (
		<>
			<animated.mesh visible={activeRing == ring && !activeTile} position={position}>
				<group ref={groupRef}>
					<Text font={'./fonts/Eveleth Clean Thin.otf'} anchorX='left' anchorY='top' fontSize={0} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={25} color={0xffffff} opacity={2}>
						<meshBasicMaterial attach='material' color={0x000000} />
					</Text>
					<Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='left' anchorY='top' position={[0, 10 - index * 2.3, 0]} fontSize={[5, 4, 3, 2, 0.5, 1][index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={5} outlineOpacity={0.25} opacity={2} color={0xffffff}>
						{title}
					</Text>
					<Text font={'./fonts/Eveleth Clean Thin.otf'} anchorX='left' anchorY='top' position={[0, 0, 0]} fontSize={[5, 4, 3, 2, 0.5, 1][index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={5} outlineOpacity={0.25} opacity={2} color={0xffffff}>
						{subtitle}
					</Text>
					<Text font={'Montserrat'} anchorX='left' anchorY='top' position={[0, 0, 0]} fontSize={[1.5, 1.25, 0.75, 0.4, 0.2, 0.2][index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.1} outlineOpacity={0.25} opacity={2} color={0xffffff} maxWidth={[50, 50, 30, 10, 4, 4][index]}>
						{description}
					</Text>
				</group>
			</animated.mesh>
		</>
	)
}

function TextSection(props) {
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
		// if (!textContentRef.current) return
		// textContentRef.current.quaternion.copy(camera.quaternion)
		textContentRef.current.lookAt(camera.position)
	})

	function fetchScale(index) {
		let scale = 50
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

	let yElevationArr = [40, 50, 35, 30, 20]
	const linePoints = []
	let bottomVector = new THREE.Vector3(position.x, position.y + 10, position.z)
	let topVector = new THREE.Vector3(position.x, position.y + yElevationArr[index] - 5, position.z)
	linePoints.push(bottomVector)
	linePoints.push(topVector)

	const visible = currentView != 'HirecoCenter'

	return (
		<>
			<animated.mesh position-y={iconElevationActive} visible={visible}>
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
							{/* <Line points={[[10, -10, 100]]} color='white' lineWidth={10} segments dashed={false} vertexColors={[[0, 0, 0]]} /> */}
							<Line points={linePoints} color={'white'} lineWidth={1} dashed={true} />
							<group position={[0, [40, 50, 35, 30, 20][index], 0]}>
								<Text font={'./fonts/Eveleth Clean Thin.otf'} anchorX='center' anchorY='middle' position={position} fontSize={0} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={25} color={0xffffff} opacity={2}>
									<meshBasicMaterial attach='material' color={0x000000} />
								</Text>
								<Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='center' anchorY='middle' position={position} fontSize={[6, 5.5, 5, 4, 3, 15][index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={5} outlineOpacity={0.25} opacity={2} ref={textContentRef} color={0xffffff}>
									{copy[nodeName].title}
								</Text>
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

function SampledNode(props) {
	const { ring, node, materials } = props
	// console.log('ring')
	// console.log(ring)
	const lightInstanceMesh = useRef()
	const asteroidInstanceMesh = useRef()
	const meshRef = useRef()

	// console.log('node')
	// console.log(node)

	const sizes = {
		asteroid: {
			ring_2: 0,
			ring_3: 0.15 * 0.08,
			ring_4: 0.15 * 0.2,
			ring_5: 0.15 * 0.5,
			ring_6: 0.15
		},
		light: {
			ring_2: 0,
			ring_3: 0.05 * 0.08,
			ring_4: 0.05 * 0.2,
			ring_5: 0.05 * 0.5,
			ring_6: 0.05
		}
	}

	const amount = {
		asteroid: {
			ring_2: 10000 * 0.02,
			ring_3: 10000 * 0.08,
			ring_4: 10000 * 0.2,
			ring_5: 10000 * 0.5,
			ring_6: 10000
		},
		light: {}
	}

	// console.log('ring')
	// console.log(ring)

	// if (!nodes[a] || !nodes[a].geometry) return <></>

	const getUniverseStores = appState(state => state.getUniverseStores)
	const { colorValues } = getUniverseStores()
	let col = new THREE.Color(...colorValues[3])

	return (
		<>
			{/* <meshBasicMaterial {...materials['RING.006']} opacity={1} /> */}
			<mesh castShadow receiveShadow geometry={node.geometry} ref={meshRef}>
				<meshBasicMaterial attach='material' color='black' opacity={0} transparent alpha={true} depthTest={false} />
			</mesh>

			<instancedMesh args={[null, null, 1000]} ref={lightInstanceMesh}>
				<sphereGeometry args={[sizes.light[ring], 5, 5]} />
				<meshStandardMaterial opacity={2} emissive={col} color={col} toneMapped={false}></meshStandardMaterial>
			</instancedMesh>
			<instancedMesh args={[null, null, 1_000]} ref={asteroidInstanceMesh}>
				<sphereGeometry args={[sizes.asteroid[ring], 5, 5]} />
				<meshStandardMaterial transparent color={'black'} opacity={1} emissive={'black'} emissiveIntensity={2}></meshStandardMaterial>
			</instancedMesh>
			<Sampler count={amount.asteroid[ring]} mesh={meshRef} instances={lightInstanceMesh} transform={transformInstancesRandom} />
			<Sampler count={amount.asteroid[ring]} mesh={meshRef} instances={asteroidInstanceMesh} transform={transformInstancesRandom} />
		</>
	)
}

function UniverseGradient(props) {
	const { nodes, materials } = useGLTF('./models/universe/universe_gradient_v8.glb')

	const getUniverseStores = appState(state => state.getUniverseStores)
	const activeTile = appState(state => state.activeTile)

	const { colorValues } = getUniverseStores()

	// console.log(colorValues[1])
	// let col = new THREE.Color(...colorValues[1])
	let col = new THREE.Color(...[0.0831, 0.25, 0.007])

	Object.keys(materials).forEach(a => {
		let key = a

		// let multiplier = 1
		// materials[a].emissive = new THREE.Color(...[0.0831 * 0.75, 0.25 * 0.75, 0.007 * 0.75])
		materials[a].emissiveIntensity = 3
		materials[a].transparent = true
		materials[a].alpha = true

		materials[a].color = col
		materials[a].toneMapped = false
	})

	const { activeTileOpacity } = useSpring({
		activeTileOpacity: activeTile ? 0.5 : 1,
		config: config.gentle
	})

	return (
		<>
			{Object.values(nodes).map(a => {
				// console.log(a)
				if (a.name.includes('_tube') || a.type != 'Mesh') return <></>
				return <SampledNode ring={a.name} node={a} materials={materials}></SampledNode>
			})}

			<group {...props} dispose={null} scale-y={1}>
				<mesh castShadow receiveShadow geometry={nodes.ring_2_tube.geometry}>
					<a.meshBasicMaterial {...materials['H ORANGE.002']} opacity={activeTileOpacity} />
				</mesh>
				<mesh castShadow receiveShadow geometry={nodes.ring_3_tube.geometry}>
					<a.meshBasicMaterial {...materials['H ORANGE.002']} opacity={activeTileOpacity} />
				</mesh>
				<mesh castShadow receiveShadow geometry={nodes.ring_4_tube.geometry}>
					<a.meshBasicMaterial {...materials['H ORANGE.002']} opacity={activeTileOpacity} />
				</mesh>
				<mesh castShadow receiveShadow geometry={nodes.ring_5_tube.geometry}>
					<a.meshBasicMaterial {...materials['H ORANGE.002']} opacity={activeTileOpacity} />
				</mesh>
				<mesh castShadow receiveShadow geometry={nodes.ring_6_tube.geometry}>
					<a.meshBasicMaterial {...materials['H ORANGE.002']} opacity={activeTileOpacity} />
				</mesh>
			</group>
		</>
	)
}

useGLTF.preload('./models/universe/universe_gradient_v8.glb')
useGLTF.preload('./models/universe/hireco_3DScene_ringR-v1-forGLTF.glb')
useGLTF.preload('./models/universe/hireco_3DScene_ringRAndO-v1-forGLTF.glb')
useGLTF.preload('./models/hireco_3DScene_sectLocation-v1.glb')
