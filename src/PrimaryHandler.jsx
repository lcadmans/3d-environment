import { CameraControls, MeshReflectorMaterial, PerspectiveCamera, Environment, OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import Primary from './Primary'

import { cameraPositionsStore } from './data/positions'

import { button, buttonGroup, folder, useControls } from 'leva'
import * as THREE from 'three'
import { BufferAttribute, DoubleSide, Vector3, Euler, Quaternion } from 'three'
import { appState } from './store/store'

function PrimaryHandler() {
	// let camera = new THREE.PerspectiveCamera(90, 1.5, 0.1, 1000)
	// let [x, y, z] = [0, 1, 2]
	// camera.position.set(x, y, z)
	const [loaded, setLoaded] = useState(false)
	return (
		<>
			<Canvas
				style={{ height: '100vh' }}
				shadows
				// gl={{ alpha: false }}
				onCreated={() => {
					// setLoaded(true)
				}}
			>
				<color attach='background' args={['#191920']} />
				<fog attach='fog' args={['#191920', 0, 15]} />
				{/* <group position={[0, -0.53, 0]}>
					<mesh rotation={[-Math.PI / 2, 0, 0]}>
						<MeshReflectorMaterial blur={[300, 100]} resolution={2048} mixBlur={1} mixStrength={50} roughness={1} depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4} color='#050505' metalness={0.5} />
						<planeGeometry args={[50, 50]} />
						<MeshReflectorMaterial blur={[400, 100]} resolution={1024} mixBlur={1} mixStrength={15} depthScale={1} minDepthThreshold={0.85} color='#151515' metalness={0.6} roughness={1} />
					</mesh>
				</group> */}
				<Scene></Scene>
				<Environment preset='sunset' blur={0} />
			</Canvas>
		</>
	)
}

const Scene = () => {
	const DEG2RAD = degrees => degrees * (Math.PI / 180)

	const cameraControlsRef = useRef()
	const cameraRef = useRef()
	// const { camera } = useThree()
	const [sceneViewMode, setSceneViewMode] = useState('test')
	const [aspects, setAspects] = useState([0.2, 0.1])
	const [cameraFov, setCameraFov] = useState(50)

	const [cameraPositions, setCameraPositions] = useState([
		{
			position: {
				x: -0.515369832952076,
				y: 0.3402030413837736,
				z: 1.260743596210799
			},
			rotation: {
				// isEuler: true,
				_x: -0.26356564946811545,
				_y: -0.3758996783984259,
				_z: -0.09873985310850206,
				_order: 'XYZ'
			},
			quaternion: {
				isQuaternion: true,
				_x: -0.11978952519651971,
				_y: -0.19136990787125943,
				_z: -0.023538554226119744,
				_w: 0.9738962801445962
			},
			target: {
				x: 0,
				y: 0,
				z: 0
			}
		}
	])

	const activeSlide = appState(state => state.activeSlide)

	useEffect(() => {
		if (activeSlide == 0) return
		console.log('made')
		updateCameraPosition()
		// cameraControlsRef.current?.setTarget(cameraPositionsStore.focus[activeSlide].target.x, cameraPositionsStore.focus[activeSlide].target.y, cameraPositionsStore.focus[activeSlide].target.z, true)
		// cameraControlsRef.current?.setPosition(cameraPositionsStore.focus[activeSlide].position.x, cameraPositionsStore.focus[activeSlide].position.y, cameraPositionsStore.focus[activeSlide].position.z, true)
		// cameraControlsRef.current?.rotation(cameraPositionsStore.focus[activeSlide].rotation._x, cameraPositionsStore.focus[activeSlide].rotation._y, cameraPositionsStore.focus[activeSlide].rotation._z, true)
	}, [activeSlide])

	function updateCameraPosition() {
		cameraControlsRef.current?.setTarget(cameraPositionsStore.focus[1].target.x, cameraPositionsStore.focus[1].target.y, cameraPositionsStore.focus[1].target.z, true)
		cameraControlsRef.current?.setPosition(cameraPositionsStore.focus[1].position.x, cameraPositionsStore.focus[1].position.y, cameraPositionsStore.focus[1].position.z, true)
		// cameraControlsRef.current?.rotation(cameraPositionsStore.focus[1].rotation._x, cameraPositionsStore.focus[1].rotation._y, cameraPositionsStore.focus[1].rotation._z, true)
	}

	const [activeCameraSettings, setActiveCameraSettings] = useState({
		target: { x: cameraPositions[0].target.x, y: cameraPositions[0].target.y, z: cameraPositions[0].target.z },
		position: { x: cameraPositions[0].position.x, y: cameraPositions[0].position.y, z: cameraPositions[0].position.z },
		rotation: { x: cameraPositions[0].rotation._x, y: cameraPositions[0].rotation._y, z: cameraPositions[0].rotation._z }
	})

	function updateActiveCameraSettings(position, rotation, quaternion, target) {
		position = new Vector3(position.x, position.y, position.z, true)
		rotation = new Euler(rotation._x, rotation._y, rotation._z, rotation._order)
		// cameraControlsRef.current?.setPosition(position.x, position.y, position.z)
		// cameraControlsRef.current?.setrotation(rotation._x, rotation._y, rotation._z)
		setActiveCameraSettings({ position: position, rotation: rotation, quaternion: quaternion, target: target })
	}

	let obj = {}
	cameraPositions.forEach(
		(a, i) =>
			(obj[i] = () => {
				cameraControlsRef.current?.setTarget(cameraPositions[i].target.x, cameraPositions[i].target.y, cameraPositions[i].target.z, true)
				cameraControlsRef.current?.setPosition(cameraPositions[i].position.x, cameraPositions[i].position.y, cameraPositions[i].position.z, true)
				// cameraControlsRef.current?.setPosition(cameraPositions[i].position.x, cameraPositions[i].position.y, cameraPositions[i].position.z, true)
				// cameraControlsRef.current?.rotation(cameraPositions[i].rotation._x, cameraPositions[i].rotation._y, cameraPositions[i].rotation._z, true)
				// cameraControlsRef.current?.rotation(cameraPositions[i].rotation._x, cameraPositions[i].rotation._y, cameraPositions[i].rotation._z, true)
				// const cameraQuanternion = new Quaternion(cameraPositions[i].quaternion._x, cameraPositions[i].quaternion._y, cameraPositions[i].quaternion._z, cameraPositions[i].quaternion._w)
			})
	)

	let cameraPositionStoreObj = {}
	Object.keys(cameraPositionsStore.focus).forEach(
		(a, i) =>
			(cameraPositionStoreObj[i] = () => {
				cameraControlsRef.current?.setTarget(cameraPositionsStore.focus[a].target.x, cameraPositionsStore.focus[a].target.y, cameraPositionsStore.focus[a].target.z, true)
				cameraControlsRef.current?.setPosition(cameraPositionsStore.focus[a].position.x, cameraPositionsStore.focus[a].position.y, cameraPositionsStore.focus[a].position.z, true)
				// cameraControlsRef.current?.rotation(cameraPositionsStore.focus[a].rotation._x, cameraPositionsStore.focus[a].rotation._y, cameraPositionsStore.focus[a].rotation._z, true)
				// updateActiveCameraSettings(cameraPositionsStore.focus[a].position, cameraPositionsStore.focus[a].rotation, cameraPositionsStore.focus[a].quaternion, cameraPositionsStore.focus[a].target)
			})
	)

	const [cameraPositionOpts, setCameraPositionOpts] = useState(obj)
	const { camera } = useThree()

	// All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html
	const { minDistance, enabled, verticalDragToForward, dollyToCursor, infinityDolly } = useControls({
		cameraSettings: folder(
			{
				aspect: { value: [0.2, 0.1], label: 'aspect', min: 0, max: 1 },
				fov: { value: 50, label: 'fov', min: 0, max: 100 },
				Update: button(get => {
					return setAspects([get('cameraSettings.aspect')[1], get('cameraSettings.aspect')[0]]), setCameraFov(get('cameraSettings.fov'))
				}),
				CamTest: buttonGroup({
					label: 'CamTest',
					opts: {
						t: () => {
							updateCameraPosition()
							// console.log(activeCameraSettings.target.x, activeCameraSettings.target.y, activeCameraSettings.target.z)
							// camera.current?.
						}
					}
				})
			},
			{ collapsed: false }
		),
		cameraPositions: folder(
			{
				cameraPositions: buttonGroup({
					label: 'positions',
					opts: cameraPositionOpts
				}),
				focusCameraPositions: buttonGroup({
					label: 'focusPositions',
					opts: cameraPositionStoreObj
				}),
				Save: button(() => {
					return setCameraPositions([
						...cameraPositions,
						{
							position: {
								x: -0.26253298213365456,
								y: -0.25236362069630836,
								z: 1.350038529981585
							},
							rotation: {
								isEuler: true,
								_x: -0.19524206027822802,
								_y: 0.203095692646267,
								_z: 0.03986778904838627,
								_order: 'XYZ'
							}
						}
					])
				})
			},
			{ collapsed: false }
		),
		Main: folder(
			{
				viewMode: buttonGroup({
					label: 'ViewMode',
					opts: {
						r: () => setSceneViewMode('restricted'),
						o: () => setSceneViewMode('orbit'),
						t: () => setSceneViewMode('test')
					}
				}),
				thetaGrp: buttonGroup({
					label: 'rotate theta',
					opts: {
						'+45º': () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
						'-90º': () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
						'+360º': () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true)
					}
				}),
				phiGrp: buttonGroup({
					label: 'rotate phi',
					opts: {
						'+20º': () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
						'-40º': () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true)
					}
				}),
				truckGrp: buttonGroup({
					label: 'truck',
					opts: {
						'(1,0)': () => cameraControlsRef.current?.truck(1, 0, true),
						'(0,1)': () => cameraControlsRef.current?.truck(0, 1, true),
						'(-1,-1)': () => cameraControlsRef.current?.truck(-1, -1, true)
					}
				}),
				dollyGrp: buttonGroup({
					label: 'dolly',
					opts: {
						1: () => cameraControlsRef.current?.dolly(1, true),
						'-1': () => cameraControlsRef.current?.dolly(-1, true)
					}
				}),
				zoomGrp: buttonGroup({
					label: 'zoom',
					opts: {
						'/2': () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
						'/-2': () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true)
					}
				}),
				minDistance: { value: 0 }
			},
			{ collapsed: true }
		),

		moveTo: folder(
			{
				vec1: { value: [3, 5, 2], label: 'vec' },
				'moveTo(…vec)': button(get => cameraControlsRef.current?.moveTo(...get('moveTo.vec1'), true))
			},
			{ collapsed: true }
		),
		other: folder(
			{
				'fitToBox(mesh)': button(() => cameraControlsRef.current?.fitToBox(meshRef.current, true))
			},
			{ collapsed: true }
		),

		setPosition: folder(
			{
				vec2: { value: [-5, 2, 1], label: 'vec' },
				'setPosition(…vec)': button(get => cameraControlsRef.current?.setPosition(...get('setPosition.vec2'), true))
			},
			{ collapsed: true }
		),
		setTarget: folder(
			{
				vec3: { value: [3, 0, -3], label: 'vec' },
				'setTarget(…vec)': button(get => cameraControlsRef.current?.setTarget(...get('setTarget.vec3'), true))
			},
			{ collapsed: true }
		),
		setLookAt: folder(
			{
				vec4: { value: [1, 2, 3], label: 'position' },
				vec5: { value: [1, 1, 0], label: 'target' },
				'setLookAt(…position, …target)': button(get => cameraControlsRef.current?.setLookAt(...get('setLookAt.vec4'), ...get('setLookAt.vec5'), true))
			},
			{ collapsed: true }
		),
		lerpLookAt: folder(
			{
				vec6: { value: [-2, 0, 0], label: 'posA' },
				vec7: { value: [1, 1, 0], label: 'tgtA' },
				vec8: { value: [0, 2, 5], label: 'posB' },
				vec9: { value: [-1, 0, 0], label: 'tgtB' },
				t: { value: Math.random(), label: 't', min: 0, max: 1 },
				'f(…posA,…tgtA,…posB,…tgtB,t)': button(get => {
					return cameraControlsRef.current?.lerpLookAt(...get('lerpLookAt.vec6'), ...get('lerpLookAt.vec7'), ...get('lerpLookAt.vec8'), ...get('lerpLookAt.vec9'), get('lerpLookAt.t'), true)
				})
			},
			{ collapsed: true }
		),
		other: folder(
			{
				'fitToBox(mesh)': button(() => cameraControlsRef.current?.fitToBox(meshRef.current, true)),
				saveState: button(() => cameraControlsRef.current?.saveState()),
				reset: button(() => cameraControlsRef.current?.reset(true)),
				enabled: { value: true, label: 'controls on' },
				verticalDragToForward: { value: false, label: 'vert. drag to move forward' },
				dollyToCursor: { value: false, label: 'dolly to cursor' },
				infinityDolly: { value: false, label: 'infinity dolly' }
			},
			{ collapsed: true }
		)
	})

	function getCameraInformation(e) {
		let cameraInformation = {}
		// console.log(cameraControlsRef.current)
		cameraInformation.position = cameraControlsRef.current._camera.position.clone()
		cameraInformation.rotation = cameraControlsRef.current._camera.rotation.clone()
		cameraInformation.quaternion = cameraControlsRef.current._camera.quaternion.clone()
		cameraInformation.target = cameraControlsRef.current._target.clone()
		console.log(cameraInformation)
	}

	// useEffect(() => {
	// 	// if (loaded && activeCameraSettings) {
	// 	cameraControlsRef.current?.setTarget(cameraPositions[0].target.x, cameraPositions[0].target.y, cameraPositions[0].target.z, true)
	// 	cameraControlsRef.current?.setPosition(activeCameraSettings.position.x, activeCameraSettings.position.y, activeCameraSettings.position.z, true)
	// 	// cameraControlsRef.current?.rotation(activeCameraSettings.rotation._x, activeCameraSettings.rotation._y, activeCameraSettings.rotation._z, true)
	// 	// }
	// }, [])
	let vector3 = new THREE.Vector3([0, 0, 5])

	return (
		<>
			{/* {sceneViewMode == 'orbit' ? <CameraControls ref={cameraControlsRef} minDistance={minDistance} enabled={enabled} verticalDragToForward={verticalDragToForward} dollyToCursor={dollyToCursor} infinityDolly={infinityDolly} /> : null} */}
			{sceneViewMode == 'restricted' ? (
				// <PresentationControls snap global zoom={0.8} rotation={[0, -Math.PI / 4, 0]} polar={[0, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}>
				// 	<Primary></Primary>
				// </PresentationControls>
				<></>
			) : null}
			{sceneViewMode == 'test' ? (
				<>
					<CameraControls
						ref={cameraControlsRef}
						onEnd={e => getCameraInformation(e)}
						// camera={cameraRef}
						// quaternion={[-1, 5, 0, 0]}
						makedefault
						// target={vector3}
						// rotation={cameraPositions[0].rotation}
						// position={cameraPositions[0].position}
						// quaternion={cameraPositions[0].quaternion}
					/>

					<directionalLight castShadow intensity={1} position={[0, 6, 6]} shadow-mapSize={[1024, 1024]}></directionalLight>
					<PerspectiveCamera
						ref={cameraRef}
						target={[0, 0, 0]}
						makeDefault
						// manual
						aspect={aspects[0] / aspects[1]}
						fov={cameraFov}
						position={Object.values(cameraPositions[0].position)}
						rotation={Object.values(cameraPositions[0].rotation)}
						// quaternion={cameraPositions[0].quaternion}
					/>

					{/* <directionalLight castShadow intensity={1} position={[0, 6, 6]} shadow-mapSize={[2048, 2048]}>
						<orthographicCamera ref={cameraRef} makedefault attach='shadow-camera' left={-90} right={20} top={20} bottom={-20} />
					</directionalLight> */}
					{/* <Suspense fallback={<Fallback />}> */}
					<Primary></Primary>
					{/* </Suspense> */}
				</>
			) : null}
			{/* {sceneViewMode == 'orbit' ? (
				<>
					<Primary></Primary>
					<CameraControls onChange={e => console.log(e)} ref={cameraControlsRef} minDistance={minDistance} enabled={enabled} verticalDragToForward={verticalDragToForward} dollyToCursor={dollyToCursor} infinityDolly={infinityDolly} />
				</>
			) : null} */}
		</>
	)
}
export default PrimaryHandler
