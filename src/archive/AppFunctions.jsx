function updateCameraPosition(props) {
	const { cameraControlsRef, cameraPositionsStore, activeRing } = props

	if (!cameraControlsRef.current) return null

	if (activeRing == 'none') return null
	if (!cameraControlsRef.current) return null
	let [initialPositionX, initialPositionY, initialPositionZ] = [cameraControlsRef.current._camera.position.x, cameraControlsRef.current._camera.position.y, cameraControlsRef.current._camera.position.z]
	let { x: initialTargetX, y: initialTargetY, z: initialTargetZ } = cameraControlsRef.current?.getTarget()
	let [endPositionX, endPositionY, endPositionZ] = [cameraPositionsStore.focus[activeRing].position.x, cameraPositionsStore.focus[activeRing].position.y, cameraPositionsStore.focus[activeRing].position.z]

	if (currentView == 'page') {
		let { x: endTargetX, y: endTargetY, z: endTargetZ } = sectionPositions[activeRing]

		cameraControlsRef.current?.lerpLookAt(initialPositionX, initialPositionY, initialPositionZ, initialTargetX, initialTargetY, initialTargetZ, endPositionX, endPositionY, endPositionZ, endTargetX, endTargetY, endTargetZ, 1, true)
	} else {
		let [endTargetX, endTargetY, endTargetZ] = [cameraPositionsStore.focus[activeRing].target.x, cameraPositionsStore.focus[activeRing].target.y, cameraPositionsStore.focus[activeRing].target.z]
		cameraControlsRef.current?.lerpLookAt(initialPositionX, initialPositionY, initialPositionZ, initialTargetX, initialTargetY, initialTargetZ, endPositionX, endPositionY, endPositionZ, endTargetX, endTargetY, endTargetZ, 1, true)
	}
}
