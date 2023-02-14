import { AccumulativeShadows, Environment, Grid, CameraControls, PresentationControls, RandomizedLight, Sphere, Trail, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import React, { forwardRef, memo, useMemo, useRef, useState } from 'react'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
// import { ShapePath } from 'three/examples/jsm/extras/ShapePath'

import * as THREE from 'three'
import { Vector3, Vector2, Shape, ExtrudeGeometry } from 'three'
// import { Spline } from 'three/examples/jsm/curves/SplineCurve'
import { GrannyKnot } from 'three/examples/jsm/curves/CurveExtras'

import './styles/global.css'

// function Shape({ shape, color = '#000000', opacity = 1, index = 1 }) {
// 	// if (!position) return null
// 	shape = shape.shape
// 	return (
// 		<a.mesh>
// 			<a.meshPhongMaterial color={color} opacity={opacity} side={THREE.DoubleSide} depthWrite={false} transparent />
// 			<shapeGeometry args={[shape]} />
// 		</a.mesh>
// 	)
// }

const SplineComponent = ({ points }) => {
	const spline = useMemo(() => {
		const curve = new THREE.SplineCurve(points.map(point => new Vector3(...point)))

		return curve
	}, [points])

	const geometry = useMemo(() => {
		const curveGeometry = new THREE.BufferGeometry()

		const vertices = []
		const numPoints = 100
		for (let i = 0; i <= numPoints; i++) {
			vertices.push(spline.getPoint(i / numPoints))
		}

		curveGeometry.setAttribute('position', new THREE.Float32BufferAttribute(flatten(vertices), 3))

		return curveGeometry
	}, [spline])

	return (
		<line>
			<bufferGeometry attach='geometry' {...geometry} />
			<lineBasicMaterial attach='material' color={0xff0000} />
		</line>
	)
}

const ExtrudeComponent = ({ shape, depth }) => {
	const geometry = useMemo(() => {
		const shapeGeometry = new Shape(shape)
		return new ExtrudeGeometry(shapeGeometry, { depth })
	}, [shape, depth])

	return <mesh geometry={geometry} />
}

export default function Mesh() {
	const cameraControlsRef = useRef()
	const data = useLoader(SVGLoader, './circle.svg')
	let SVGMove = {}

	// create an Mesh based object with the given
	// svg data and id prefix
	SVGMove.getPoints = (data, id_prefix) => {
		let points
		data.paths.forEach(path => {
			// get id of the path
			console.log(path)
			points = path.subPaths[0].getPoints()
			// console.log('points')
			// console.log(points)
			// }
		})
		// // console.log(obj)
		// console.log(points)
		return points
	}
	// create a v2 from the given obj, useStr, valueStr, and index
	// ex getV2(obj, 'pos', 'xz', 0)
	const getV2 = (obj, useStr, valueStr, index) => {
		const ud = obj.userData
		const arr = ud[useStr + '_' + valueStr]
		const len = arr.length
		const i = THREE.MathUtils.euclideanModulo(index, len)
		return arr[i]
	}
	// create a v3 for the given obj, use string, and alpha value
	// ex crateV3(obj, 'pos', 0.35);
	const createV3 = (obj, useStr, alpha) => {
		const ud = obj.userData
		let len = 0,
			fi,
			i = 0,
			lerpAlpha
		// get current xz Vector2
		len = ud[useStr + '_xz'].length
		fi = (len - 1) * alpha // fraction index ex: 1.44
		i = Math.floor(fi) // index ex: 1
		lerpAlpha = fi % 1 // lerpAlpha from current to next point ex: 0.44
		// current pos
		const xz = getV2(obj, useStr, 'xz', i)
		const xz_next = getV2(obj, useStr, 'xz', i + 1)
		// next pos
		const y = getV2(obj, useStr, 'y', i)
		const y_next = getV2(obj, useStr, 'y', i + 1)
		// use xz Vector2 to set position of object
		const v3_current = new THREE.Vector3(xz.x, y.y, xz.y)
		const v3_next = new THREE.Vector3(xz_next.x, y_next.y, xz_next.y)
		return v3_current.clone().lerp(v3_next, lerpAlpha)
	}
	// set an object by an alpha value of 0 - 1
	SVGMove.setToAlpha = (obj, alpha) => {
		// just setting position for now
		obj.position.copy(createV3(obj, 'pos', alpha))
	}

	let svgPoints = SVGMove.getPoints(data, 'circle')

	// const shapes = useMemo(() => data.paths.flatMap((g, index) => g.toShapes(true).map(shape => ({ shape, color: g.color, index }))), [data])

	const curveTest = new GrannyKnot()
	const geometry = new THREE.TubeGeometry(curveTest, 100, 2, 8, true)
	// console.log(geometry)
	// console.log(curveTest)
	const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })

	const shape = [new Vector2(-10, 0), new Vector2(0, 10), new Vector2(10, 0), new Vector2(0, -10), new Vector2(-10, 0)]

	let points = [
		[-1.0, 0.0, 0.0],
		[0.0, 1.0, 0.0],
		[1.0, 0.0, 0.0],
		[0.0, -1.0, 0.0]
	]
	let scale = 1

	for (var i = 0; i < points.length; i++) {
		var x = points[i][0] * scale
		var y = points[i][1] * scale
		var z = points[i][2] * scale
		points[i] = new THREE.Vector3(x, z, -y)
	}

	// console.log(svgPoints)
	// console.log(points)

	return (
		<>
			<Canvas style={{ height: '100vh' }} shadows camera={{ position: [0, 0, 5], fov: 60 }}>
				{/* <Shape {...shapes[0]} /> */}
				{/* <group ref={svgGroupRef}> */}
				{/* <Sphere></Sphere> */}
				{/* <mesh ref={svgMeshRef} position={[0, 0, 0]} geometry={svgData.geometry}> */}

				{/* </mesh> */}
				{/* </group> */}
				{/* <OrbitControls global zoom={0.8} rotation={[0, -Math.PI / 4, 0]} polar={[0, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}> */}
				{/* <PresentationControls global zoom={0.8} rotation={[0, -Math.PI / 4, 0]} polar={[0, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}> */}
				{points.map(a => {
					// console.log(a)
					return (
						<Sphere args={[0.1, 32, 32]} position={a}>
							<meshNormalMaterial />
						</Sphere>
					)
				})}
				{svgPoints.map(a => {
					let x = a.x / 2000
					let y = a.y / 2000
					let xyz = new THREE.Vector3(x, y, 0)
					// console.log(xyz)
					return (
						<Sphere args={[0.1, 32, 32]} position={xyz}>
							<meshNormalMaterial />
						</Sphere>
					)
				})}

				{/* <ExtrudeComponent shape={shape} depth={10} /> */}
				{/* <mesh geometry={mesh.geometry}></mesh> */}
				<mesh geometry={geometry} material={material}></mesh>
				<Scene />
				<CameraControls ref={cameraControlsRef} />
				{/* <Shoe /> */}
				{/* </PresentationControls> */}
				{/* </OrbitControls> */}
			</Canvas>
		</>
	)
}

// function BufferPoints({ count = 1000 }) {
// 	const points = useMemo(() => {
// 		const p = new Array(count).fill(0).map(v => (0.5 - Math.random()) * 7.5)
// 		return new BufferAttribute(new Float32Array(p), 3)
// 	}, [count])

// 	return (
// 			<points>
// 				<bufferGeometry>
// 					<bufferAttribute attach={'attributes-position'} {...points} />
// 				</bufferGeometry>
// 				<pointsMaterial size={0.1} threshold={0.1} color={0xff00ff} sizeAttenuation={true} />
// 			</points>
// 	)
// }

function BufferPoints() {
	let points = [
		[-1.0, 0.0, 0.0],
		[0.0, 1.0, 0.0],
		[1.0, 0.0, 0.0],
		[0.0, -1.0, 0.0]
	]
	let scale = 1

	for (var i = 0; i < points.length; i++) {
		var x = points[i][0] * scale
		var y = points[i][1] * scale
		var z = points[i][2] * scale
		points[i] = new THREE.Vector3(x, z, -y)
	}
	console.log(points)

	// var curvePath = new THREE.CatmullRomCurve3(points)
	var curvePath = new THREE.CubicBezierCurve3(...points)
	// var curvePath = new THREE.QuadraticBezierCurve3(...points)

	var radius = 0.25

	//========== Create a tube geometry that represents our curve
	var geometry = new THREE.TubeGeometry(curvePath, 600, radius, 10, false)
	//========== Set a different color for each face of the tube. (a triangle represents 1 face in WebGL)
	// for (var i = 0, j = geometry.faces.length; i < j; i++) {
	// geometry.faces[i].color = new THREE.Color('hsl(' + Math.floor(Math.random() * 290) + ',50%,50%)')
	// }
	var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide, transparent: true, opacity: 1 })
	var tube = new THREE.Mesh(geometry, material)

	return (
		<>
			{points.map(a => {
				return (
					<Sphere args={[0.1, 32, 32]} position={a}>
						<meshNormalMaterial />
					</Sphere>
				)
			})}

			{/* <mesh geometry={geometry} material={material}></mesh> */}
			{/* <mesh>
				<bufferGeometry>
					<bufferAttribute attach='attributes-position' array={positions} count={positions.length / 3} itemSize={3} />
					<bufferAttribute attach='attributes-color' array={colors} count={colors.length / 3} itemSize={3} />
					<bufferAttribute attach='attributes-normal' array={normals} count={normals.length / 3} itemSize={3} />
					<bufferAttribute attach='index' array={indices} count={indices.length} itemSize={1} />
				</bufferGeometry>
				<meshStandardMaterial vertexColors side={DoubleSide} />
			</mesh> */}
		</>
	)
}

function Scene() {
	const cameraControlsRef = useRef()
	const meshRef = useRef()
	const sphere = useRef()
	const group = useRef()
	const { camera } = useThree()
	const [sceneViewMode, setSceneViewMode] = useState('Restricted')
	useFrame(({ clock }) => {
		const t = clock.getElapsedTime()
		// group.current.rotation.z = t
		sphere.current.position.x = Math.sin(t * 2) * 2
		sphere.current.position.z = Math.cos(t * 2) * 2
	})

	// All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html

	return (
		<>
			<group position-y={-1}>
				<group position-y={0.5}>{/* <Shoe /> */}</group>
				<group ref={group}>
					{/* <BufferPoints /> */}

					<Trail
						width={1}
						length={4}
						color={'#F8D628'}
						attenuation={t => {
							return t * t
						}}
					>
						<Sphere ref={sphere} args={[0.1, 32, 32]} position-y={3}>
							<meshNormalMaterial />
						</Sphere>
					</Trail>
				</group>
				<Ground />
				<Shadows />
				<Environment preset='city' />
			</group>
		</>
	)
}

function Ground() {
	const gridConfig = {
		cellSize: 0.5,
		cellThickness: 0.5,
		cellColor: '#6f6f6f',
		sectionSize: 3,
		sectionThickness: 1,
		sectionColor: '#9d4b4b',
		fadeDistance: 30,
		fadeStrength: 1,
		followCamera: false,
		infiniteGrid: true
	}
	return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}

const Shadows = memo(() => (
	<AccumulativeShadows temporal frames={100} color='#9d4b4b' colorBlend={0.5} alphaTest={0.9} scale={20}>
		<RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
	</AccumulativeShadows>
))

const Suzi = forwardRef((props, ref) => {
	const { nodes } = useGLTF('https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf')
	return (
		<>
			<mesh ref={ref} castShadow receiveShadow geometry={nodes.Suzanne.geometry} {...props}>
				<meshStandardMaterial color='#9d4b4b' />
			</mesh>
		</>
	)
})
