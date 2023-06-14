import { useBounds } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useState } from 'react'
import useRefs from 'react-use-refs'
import { shallow } from 'zustand/shallow'
import { ContentHolder, HirecoUniverse } from './components'
import { cameraPositionsStore } from './data'
import { appState } from './store'

export function Scene(props) {
	const [floatGroup, hirecoUniverseRef] = useRefs()
	const currentView = appState(state => state.currentView, shallow)
	const activeRing = appState(state => state.activeRing, shallow)
	const activeTile = appState(state => state.activeTile, shallow)
	const focusElementRef = appState(state => state.focusElementRef, shallow)
	const ringNames = appState(state => state.ringNames)
	const setUpdateBounds = appState(state => state.setUpdateBounds)
	const getUniverseStores = appState(state => state.getUniverseStores)
	const setFetchData = appState(state => state.setFetchData)
	const mockData = appState(state => state.mockData)
	const { sectionPositions } = getUniverseStores()

	const [initialLoad, setInitialLoad] = useState(false)

	// useEffect(() => {
	// 	console.log('mockData')
	// 	console.log(mockData)
	// }, [mockData])

	const bounds = useBounds()

	function updateboundsFunction(props) {
		const { position, target } = props
		const { xPos, yPos, zPos } = position
		const { xTar, yTar, zTar } = target
		bounds.to({ position: [xPos, yPos, zPos], target: [xTar, yTar, zTar] })
	}

	setUpdateBounds(updateboundsFunction)

	useFrame(state => {
		const { camera } = state
		const t = state.clock.getElapsedTime()
		if (!activeTile) {
			floatGroup.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 30)
			floatGroup.current.rotation.z -= 0.02
		}

		if (currentView == 'page' && camera.fov < 75) {
			camera.fov += 0.33
			camera.updateProjectionMatrix()
		} else if (!activeTile && currentView != 'page' && camera.fov > 60) {
			console.log('return to base')
			camera.fov = camera.fov * 0.85
			if (camera.fov < 60) camera.fov = 60
			// camera.fov -= 0.7
			camera.updateProjectionMatrix()
		}
	})

	useEffect(() => {
		// Handle initial load
		if (!initialLoad) {
			const { x, y, z } = cameraPositionsStore.focus['none'].position
			updateboundsFunction({ position: { xPos: x, yPos: y, zPos: z }, target: { xTar: 0, yTar: 0, zTar: 0 } })
			bounds.to({ position: [x, y, z], target: [0, 0, 0] })
			setInitialLoad(true)
		}
	}, [])

	useEffect(() => {
		if (currentView == 'page') {
			let [endPositionX, endPositionY, endPositionZ] = [cameraPositionsStore.focus[activeRing].position.x, cameraPositionsStore.focus[activeRing].position.y, cameraPositionsStore.focus[activeRing].position.z]
			let { x: endTargetX, y: endTargetY, z: endTargetZ } = sectionPositions[activeRing]
			bounds.to({ position: [endPositionX, endPositionY, endPositionZ], target: [endTargetX, endTargetY, endTargetZ] })
		}
	}, [currentView])

	useEffect(() => {
		if (!focusElementRef) return
		bounds.refresh(focusElementRef.current)
		bounds.fit()
	}, [focusElementRef])

	return (
		<group ref={floatGroup}>
			<ContentHolder visible={currentView == 'page'} sectionName={ringNames[activeRing]} />
			<group ref={hirecoUniverseRef}>
				<HirecoUniverse />
			</group>
		</group>
	)
}
