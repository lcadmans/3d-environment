import * as THREE from 'three'
import { Object3D } from 'three'
import { shallow } from 'zustand/shallow'
import React, { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial, Html } from '@react-three/drei'
import { animated, a, update, useSpring, config } from '@react-spring/three'

import { appState } from '../store'

export const TileHtml = props => {
	const { imageSrc, title, subtitle, description, cta, id, visible } = props

	const activeTile = appState(state => state.activeTile)
	const setActiveTile = appState(state => state.setActiveTile)
	const activeTileRef = appState(state => state.activeTileRef)
	const setActiveTileRef = appState(state => state.setActiveTileRef)

	const ref = useRef()
	const meshRef = useRef()
	const groupRef = useRef()

	useEffect(() => {
		if (activeTile == id) {
			setFocusElementRef(meshRef)
		} else {
		}
	}, [activeTile])

	useEffect(() => {
		if (!activeTileRef) return
		// console.log('activeTileRef')
		// console.log(activeTileRef)
	}, [activeTileRef])

	const focusElementRef = appState(state => state.focusElementRef, shallow)
	const setFocusElementRef = appState(state => state.setFocusElementRef, shallow)

	const [isOccluded, setOccluded] = useState()
	const [isInRange, setInRange] = useState()
	const isVisible = isInRange && !isOccluded

	const vec = new THREE.Vector3()
	useFrame(state => {
		const { camera } = state
		const range = state.camera.position.distanceTo(groupRef.current.getWorldPosition(vec)) <= 10
		if (range !== isInRange) setInRange(range)
		groupRef.current.lookAt(camera.position)
	})

	return (
		<group
			ref={groupRef}
			onClick={() => {
				console.log('tileClick')
				setActiveTile(id)
				setActiveTileRef(groupRef)
			}}
		>
			<Html
				// 3D-transform contents
				transform
				// Hide contents "behind" other meshes
				// occlude
				// Tells us when contents are occluded (or not)
				// onOcclude={setOccluded}
				// We just interpolate the visible state into css opacity and transforms
				style={{ opacity: visible ? 1 : 0, transform: `scale(${visible ? 1 : 0.25})` }}
				// {...props}
			>
				<div className='text-[1px]'>
					<h1>Test Title</h1>
				</div>
			</Html>
		</group>
	)
}
