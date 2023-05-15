import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { useGLTF } from '@react-three/drei'

import * as THREE from 'three'

export const appState = create(
	devtools(set => ({
		// States
		started: false,
		activeSlide: 0,
		// activeRing: 'pageSection',
		activeRing: 'none',
		focusRing: 'none',
		numPages: 4,
		activePage: null,
		activePageNumber: null,
		currentView: 'main',
		// currentView: 'page',
		isAnimating: false,
		universeStores: null,
		cameraRefInfo: null,
		activeCameraAnchor: null,
		cameraOrbitPoints: generateCirclePoints(1.1, 7, 0.6),
		returnCameraToOrigin: null,
		forcePageUpdate: false,
		cameraControlsMouseButtons: { left: 1, middle: 8, right: 2, wheel: 0 },
		dimensions: { width: window.innerWidth, height: window.innerHeight },
		scrollControlsInitiated: false,

		// Set States
		setActiveSlide: index => set(state => ({ activeSlide: index })),
		setActiveRing: index => set(state => ({ activeRing: index })),
		setFocusRing: index => set(state => ({ focusRing: index })),
		setNumPages: index => set(state => ({ numPages: index })),
		setActivePage: index => set(state => ({ activePage: index })),
		setActivePageNumber: index => set(state => ({ activePageNumber: index })),
		setCurrentView: index => set(state => ({ currentView: index })),
		setIsAnimating: input => set(state => ({ isAnimating: input })),
		setStarted: input => set(state => ({ started: input })),
		setUniverseStores: input => set(state => ({ universeStores: input })),
		setCameraRefInfo: input => set(state => ({ cameraRefInfo: input })),
		setActiveCameraAnchor: input => set(state => ({ activeCameraAnchor: input })),
		setCameraOrbitPoints: input => set(state => ({ cameraOrbitPoints: input })),
		setReturnCameraToOrigin: input => set(state => ({ returnCameraToOrigin: input })),
		setForcePageUpdate: input => set(state => ({ forcePageUpdate: input })),
		setCameraControlsMouseButtons: input => set(state => ({ cameraControlsMouseButtons: input })),
		setDimensions: input => set(state => ({ dimensions: input })),
		setScrollControlsInitiated: input => set(state => ({ scrollControlsInitiated: input })),

		// functions
		generateCirclePoints: (radius, segments, yElevation) => generateCirclePoints(radius, segments, yElevation)
	}))
)

// const cameraPositionsStore = {}

function generateCirclePoints(radius, segments, yElevation = 0) {
	const points = []
	for (let i = 0; i < segments; i++) {
		const angle = (i / segments) * Math.PI * 2
		// let point = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
		let point = new THREE.Vector3(Math.cos(angle) * radius, yElevation, Math.sin(angle) * radius)
		points.push(point)
	}
	return points
}

const pageCopy = {
	expers: {}
}
