import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box, OrbitControls, useGLTF, useAnimations, Sphere } from '@react-three/drei'

import { SourceSection, SupportSection, SmartTechSection, ExpertSection, WelfareSection } from './iconography'

import { useSpring, animated } from '@react-spring/three'

import * as THREE from 'three'
import { LoopOnce } from 'three'

import { appState } from '../../store'

function renderSwitch(nodeName, index) {
	// console.log(nodeName)
	switch (nodeName) {
		// case 'ring_2':
		// 	return (
		// 		<>
		// 			<ExpertSection index={index} />
		// 		</>
		// 	)
		// case 'ring_3':
		// 	return (
		// 		<>
		// 			<SourceSection index={index} />
		// 		</>
		// 	)
		// case 'ring_4':
		// 	return (
		// 		<>
		// 			<SupportSection index={index} />
		// 		</>
		// 	)
		case 'ring_5':
			return (
				<>
					<SmartTechSection index={index} />
				</>
			)
		// case 'ring_6':
		// 	return (
		// 		<>
		// 			<WelfareSection index={index} />
		// 		</>
		// 	)
		default:
			return (
				<>
					<ExpertSection index={index} />
				</>
			)
	}
}

export function SetsModel(props) {
	const { index, position, nodeName } = props

	const activeRing = appState(state => state.activeRing)
	const setActiveRing = appState(state => state.setActiveRing)
	const focusRing = appState(state => state.focusRing)
	const setFocusRing = appState(state => state.setFocusRing)

	const currentView = appState(state => state.currentView)

	const [baseScale, setBaseScale] = useState(fetchScale(index))

	const [active, setActive] = useState(false)
	const { scale } = useSpring({ scale: active ? baseScale * 1.5 : baseScale })

	const group = useRef()

	useFrame(state => {
		group.current.rotation.y += 0.01
		// console.log(first)
		const t = state.clock.getElapsedTime()
		// console.log(1 + Math.sin(t))
		let equation = 1.5 + Math.sin(t * 2) / 10
		// console.log(equation)

		if (activeRing == nodeName) {
			group.current.scale.x = equation
			group.current.scale.y = equation
			group.current.scale.z = equation
		}
	})

	useEffect(() => {
		if (activeRing === nodeName) {
			// group.current.scale.set(0.1)
		}
	}, [activeRing])

	function handleMouseOver() {
		setActive(true)
		setFocusRing(nodeName)
	}

	function handleMouseOut() {
		setActive(false)
		setFocusRing('none')
	}

	// let blendingMode = 'NoBlending'
	// let blendingMode = 'NormalBlending'
	// let blendingMode = 'AdditiveBlending'
	// let blendingMode = 'SubtractiveBlending'
	// let blendingMode = 'MultiplyBlending'
	let blendingMode = 'CustomBlending'
	return (
		// <animated.mesh scale={scale} position={position}>
		<group
			onClick={() => setActiveRing(nodeName)}
			// onPointerOver={() => {
			// 	handleMouseOver()
			// 	document.body.style.cursor = 'pointer'
			// }}
			// onPointerOut={() => {
			// 	// setScale(fetchScale(index))
			// 	handleMouseOut()
			// 	document.body.style.cursor = 'default'
			// }}
			ref={group}
			// scale={scale}
			// onClick={() => setActive(!active)}
			// onPointerLeave={(document.body.style.cursor = 'cursor')}
			onPointerEnter={() => {}}
		>
			<Sphere scale={0.7}>
				<meshStandardMaterial color='black' transparent opacity={0.1} side={THREE.BackSide} />
			</Sphere>
			{/* <Sphere scale={0.7}>
				<meshStandardMaterial color='white' wireframe transparent opacity={0.005} />
			</Sphere> */}
			{renderSwitch(nodeName, index)}
		</group>
		// </animated.mesh>
	)
}

function fetchScale(index) {
	let scale = 0.4
	index = index + 4
	scale = scale / index

	return scale
}
