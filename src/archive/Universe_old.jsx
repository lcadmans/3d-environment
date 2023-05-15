import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import * as THREE from 'three'

import { MathUtils } from 'three'

import { useFrame } from '@react-three/fiber'
import { Cylinder, Cone, Tetrahedron, Point, Points, AccumulativeShadows, Sphere, PointMaterial, Torus, Box, Grid, RandomizedLight, useGLTF, Environment, Text } from '@react-three/drei'
import { BufferAttribute } from 'three'

// Random float from <low, high> interval
function randFloat(low, high) {
	return low + Math.random() * (high - low)
}

function fillWithPoints(geometry, count) {
	var dummyTarget = new THREE.Vector3() // to prevent logging of warnings from ray.at() method

	var ray = new THREE.Ray()

	var size = new THREE.Vector3()
	geometry.computeBoundingBox()
	let bbox = geometry.boundingBox

	let points = []

	var dir = new THREE.Vector3(1, 1, 1).normalize()
	/*for (let i = 0; i < count; i++) {
      let p = setRandomVector(bbox.min, bbox.max);
      points.push(p);
    }*/
	let counter = 0
	while (counter < count) {
		let v = new THREE.Vector3(randFloat(bbox.min.x, bbox.max.x), randFloat(bbox.min.y, bbox.max.y), randFloat(bbox.min.z, bbox.max.z))
		if (isInside(v)) {
			points.push(v)
			counter++
		}
	}

	function isInside(v) {
		ray.set(v, dir)
		let counter = 0

		let pos = geometry.attributes.position
		let faces = pos.count / 3
		//console.log(faces);
		let vA = new THREE.Vector3(),
			vB = new THREE.Vector3(),
			vC = new THREE.Vector3()
		for (let i = 0; i < faces; i++) {
			vA.fromBufferAttribute(pos, i * 1 + 0)
			vB.fromBufferAttribute(pos, i * 2 + 1)
			vC.fromBufferAttribute(pos, i * 3 + 2)

			// console.log(ray.intersectTriangle(vA, vB, vC, false, dummyTarget))
			if (ray.intersectTriangle(vA, vB, vC, false, dummyTarget)) {
				counter++
			}
		}
		// return true
		return counter % 2 == 1
	}
	console.log(points.length)
	return points
}

export function HirecoUniverse_buffer(props) {
	const [filledBufferPoints, setFilledBufferPoints] = useState()

	const [points, setPoints] = useState()
	const [shapePoints, setShapePoints] = useState()
	const bufferRef = useRef()
	const sphereRef = useRef()
	const pointsRef = useRef()

	const positions = new Float32Array([-0.1, 0, 0, 0.1, 0, 0])
	const colors = new Float32Array([1, 0.5, 0.5, 1, 0.5, 0.5])

	// let count = 1000
	// const pointsMemo = useMemo(() => {
	// 	const p = new Array(count).fill(0).map(v => (0.5 - Math.random()) * 7.5)
	// 	console.log(p)
	// 	return new BufferAttribute(new Float32Array(p), 3)
	// }, [count])

	useEffect(() => {
		console.log('sphereRefChange')

		if (!sphereRef.current.geometry) return

		var _points = fillWithPoints(sphereRef.current.geometry, 2000)

		let positions = []

		_points.forEach((point, i) => {
			positions.push(point.x, point.y, point.z)
		})

		const bufferAttribute = new THREE.BufferAttribute(new Float32Array(positions), 3)

		setPoints(bufferAttribute)
	}, [sphereRef])

	// useEffect(() => {
	// 	if (!points) return
	// 	// console.log(points)
	// 	// console.log(new THREE.BufferGeometry().setFromPoints(points))

	// 	const geometry = new THREE.BufferGeometry()
	// 	geometry.setFromPoints(points)
	// }, [points])

	// useEffect(() => {
	// 	console.log('filledBufferPoints')
	// 	console.log(filledBufferPoints)

	// 	var pointsMat = new THREE.PointsMaterial({ color: 'aqua', size: 0.25 })
	// 	var points = new THREE.Points(filledBufferPoints, pointsMat)

	// 	// scene.add(points)
	// 	console.log(points)
	// 	console.log('points')
	// 	pointsRef.current = points
	// 	pointsRef.current.position.set([])
	// }, [filledBufferPoints])

	// useLayoutEffect(() => {
	// 	// setPositionsBuffer(new THREE.BufferGeometry().setFromPoints(points))
	// 	if (bufferRef.current) {
	// 		if (points) {
	// 			// console.log(points)
	// 			bufferRef.current.setFromPoints(points)
	// 		}
	// 	}
	// }, [points])

	// let count = 1000
	// const _points = useMemo(() => {
	// 	const p = new Array(count).fill(0).map(v => (0.5 - Math.random()) * 7.5)
	// 	console.log(p)
	// 	return new BufferAttribute(new Float32Array(p), 3)
	// }, [count])

	// useEffect(() => {
	// 	setPoints(_points)
	// }, [_points])

	// let count = 1000
	// const _points = useMemo(() => {
	// 	const p = new Array(count).fill(0).map(v => (0.5 - Math.random()) * 7.5)
	// 	return new BufferAttribute(new Float32Array(p), 3)
	// }, [count])

	// useEffect(() => {
	// 	setPoints(_points)
	// }, [_points])

	// console.log(_points)

	return (
		<>
			<Cylinder ref={sphereRef} args={[1, 3, 5, 5]}>
				<meshBasicMaterial wireframe color='hotpink' />
				{/* <bufferGeometry>
					<bufferAttribute />
				</bufferGeometry> */}
				{/* <points ref={pointsRef}> */}

				{/* <bufferGeometry attach='geometry' ref={bufferRef}>
					<bufferAttribute attach='attributes-position' count={positions.length / 3} array={positions} itemSize={3} usage={THREE.DynamicDrawUsage} />
					<bufferAttribute attach='attributes-color' count={colors.length / 3} array={colors} itemSize={3} usage={THREE.DynamicDrawUsage} />
				</bufferGeometry>
				<pointsMaterial attach='material' vertexColors size={10} sizeAttenuation={false} /> */}
				{/* </points> */}
				<points>
					<bufferGeometry>
						<bufferAttribute attach={'attributes-position'} {...points} />
					</bufferGeometry>
					<pointsMaterial size={0.05} color={0xff00ff} />
				</points>
			</Cylinder>
			{/* <points>
				<bufferGeometry attach='geometry' ref={bufferRef}>
					<PointMaterial transparent vertexColors sizeAttenuation={false} depthWrite={false} color={'aqua'} size={0.25}>
						<bufferAttribute attach='attributes-position' />
					</PointMaterial>
				</bufferGeometry>
			</points> */}

			{/* <Points
				positions={positionsBuffer}
				// colors={colorsBuffer}
				// sizes={sizesBuffer}
				ref={pointsRef}
			>
				<pointsMaterial color={'aqua'} size={0.25} />
			</Points>

			<Points limit={1000}>
				<pointsMaterial vertexColors />
				<Point position={[0, 0, 0]} color='red' />
				// As many as you want, make them conditional, mount/unmount them, lazy load them, etc ...
			</Points> */}

			{/* {shapePoints ? (
				<points>
					<bufferGeometry>
						<bufferAttribute attach={'attributes-position'} {...shapePoints} />
					</bufferGeometry>
					<pointsMaterial size={5} threshold={0.1} color={0xff00ff} sizeAttenuation={true} />
				</points>
			) : (
				<> </>
			)} */}

			{/* <points>
				<bufferGeometry attach='geometry' ref={bufferRef}>
					<bufferAttribute attach='attributes-position' />
					<bufferAttribute attach='attributes-color' count={colors.length / 3} array={colors} itemSize={3} usage={THREE.DynamicDrawUsage} />
				</bufferGeometry>
			</points> */}
		</>
	)
}

export function HirecoUniverse(props) {
	let ring_1 = useRef()
	let ring_2 = useRef()
	let ring_3 = useRef()
	let ring_4 = useRef()
	let ring_5 = useRef()
	let ring_6 = useRef()
	let hireco_icon = useRef()
	let hireco_icon_2 = useRef()

	let refs = [ring_1, ring_2, ring_3, ring_4, ring_5, ring_6, hireco_icon, hireco_icon_2]

	useFrame(state => {
		const t = state.clock.getElapsedTime()
		refs.forEach(ref => {
			ref.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 30)
			ref.current.position.y = (1 + Math.sin(t / 1.5)) / 100
		})
	})

	const { nodes, materials } = useGLTF('./models/universe_v14_transformed.glb')
	return (
		<group {...props} dispose={null}>
			<mesh castShadow receiveShadow geometry={nodes.ring_3.geometry} material={materials['RING PARTICLES']} ref={ring_3} />
			<mesh castShadow receiveShadow geometry={nodes.ring_2.geometry} material={materials['RING PARTICLES']} ref={ring_2} />
			<mesh castShadow receiveShadow geometry={nodes.ring_1.geometry} material={materials['H ORANGE']} scale={[1, 1.03, 1]} ref={ring_1} />
			<mesh castShadow receiveShadow geometry={nodes.hirecoH_1.geometry} material={materials['H ORANGE']} scale={14} ref={hireco_icon} />
			<mesh castShadow receiveShadow geometry={nodes.hirecoH_2.geometry} material={materials['H ORANGE']} scale={14} ref={hireco_icon_2} />
			<mesh castShadow receiveShadow geometry={nodes.ring_4.geometry} material={materials['RING PARTICLES']} ref={ring_4} />
			<mesh castShadow receiveShadow geometry={nodes.ring_5.geometry} material={materials['RING PARTICLES']} ref={ring_5} />
			<mesh castShadow receiveShadow geometry={nodes.ring_6.geometry} material={materials['RING PARTICLES']} ref={ring_6} />
		</group>
	)
}

useGLTF.preload('./models/universe_v14_transformed.glb')
useGLTF.preload('./models/universe.glb')
