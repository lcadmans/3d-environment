// useEffect(() => {
// 	cameraControlsRef.current?.setTarget(cameraPositions[0].target.x, cameraPositions[0].target.y, cameraPositions[0].target.z, true)
// 	cameraControlsRef.current?.setPosition(cameraPositions[0].position.x, cameraPositions[0].position.y, cameraPositions[0].position.z, true)
// }, [cameraControlsRef])

// useEffect(() => {
// 	// cameraRef.current.lookAt(0, 0, 0)
// 	returnToCameraOrigin()
// }, [cameraControlsRef])

// useFrame(state => {
// 	const { camera } = state
// 	const t = state.clock.getElapsedTime()
// 	const { x, y, z } = activeCameraSettings.position

// 	// cameraControlsRef.current.setLookAt(x, y, z, 0, 0, 0)

// 	// camera.lookAt(0, 100, 0)
// 	// camera.position.x = t / 100
// 	// camera.rot/ation.x = t / 100
// 	// camera.position.x += 0.1
// 	// camera.position.z = target.position.z + radius * Math.sin(constant * elapsedTime)
// 	// camera.lookAt(target.position)
// })

// function returnToCameraOrigin() {
// 	console.log('return')
// 	if (!cameraControlsRef || !cameraControlsRef.current) return null
// 	const { x, y, z } = activeCameraSettings.position
// 	let [initialPositionX, initialPositionY, initialPositionZ] = [5, 0, 0]
// 	let [initialTargetX, initialTargetY, initialTargetZ] = [0, 0, 0]
// 	let [endPositionX, endPositionY, endPositionZ] = [x, y, z]
// 	let [endTargetX, endTargetY, endTargetZ] = [0, 0, 0]
// 	cameraControlsRef.current.setLookAt(endPositionX, endPositionY, endPositionZ, endTargetX, endTargetY, endTargetZ, true)

// 	// cameraControlsRef.current.lerpLookAt(initialPositionX, initialPositionY, initialPositionZ, initialTargetX, initialTargetY, initialTargetZ, endPositionX, endPositionY, endPositionZ, endTargetX, endTargetY, endTargetZ, 1, true)
// 	// cameraControlsRef.current.lerpLookAt(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, true)
// }
