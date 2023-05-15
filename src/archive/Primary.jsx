import { SetsModel } from '../Models/Set'
import { AccumulativeShadows, Grid, RandomizedLight, useGLTF, Environment, Text, Float, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { memo, useMemo, useRef } from 'react'

import { HirecoUniverse } from '../components'

import { proxy } from 'valtio'

import * as THREE from 'three'
import { BufferAttribute } from 'three'

import fragmentShader from '../shaders/fragmentShader'
import vertexShader from '../shaders/vertexShader'

import { appState } from '../store/store'

import './styles/global.css'

export default function Primary() {
	return (
		<>
			<Scene />
		</>
	)
}

function BufferPoints({ count = 1000 }) {
	const points = useMemo(() => {
		const p = new Array(count).fill(0).map(v => (0.5 - Math.random()) * 3.5)
		return new BufferAttribute(new Float32Array(p), 4)
	}, [count])

	return (
		<points>
			<bufferGeometry>
				<bufferAttribute attach={'attributes-position'} {...points} />
			</bufferGeometry>
			<pointsMaterial size={0.1} threshold={0.1} color={0xeb8913} sizeAttenuation={true} />
		</points>
	)
}

const CustomGeometryParticles = props => {
	const { count } = props
	const radius = 2

	// This reference gives us direct access to our points
	const points = useRef()

	// Generate our positions attributes array
	const particlesPosition = useMemo(() => {
		const positions = new Float32Array(count * 100)

		for (let i = 0; i < count; i++) {
			const distance = Math.sqrt(Math.random() - 0.7) * radius
			const theta = THREE.MathUtils.randFloatSpread(360)
			const phi = THREE.MathUtils.randFloatSpread(5)

			let x = distance * Math.sin(theta) * Math.cos(phi) * 3
			let y = distance * Math.sin(theta) * Math.sin(phi) * 3
			let z = distance * Math.cos(theta)

			positions.set([x, y, z], i * 1.5)
		}

		return positions
	}, [count])

	const uniforms = useMemo(
		() => ({
			uTime: {
				value: 0.0
			},
			uRadius: {
				value: radius
			}
		}),
		[]
	)

	useFrame(state => {
		const { clock } = state

		points.current.material.uniforms.uTime.value = clock.elapsedTime
	})

	return (
		<points ref={points}>
			<bufferGeometry>
				<bufferAttribute attach='attributes-position' count={particlesPosition.length / 3} array={particlesPosition} itemSize={3} />
			</bufferGeometry>
			<shaderMaterial depthWrite={false} fragmentShader={fragmentShader} vertexShader={vertexShader} uniforms={uniforms} />
		</points>
	)
}

function TextContent({ position, index }) {
	const ref = useRef()
	useFrame(({ camera }) => {
		// Make text face the camera
		ref.current.lookAt(camera.position)
		// Animate font color
		// ref.current.material.color.lerp(color.set(hovered ? '#fa2720' : 'white'), 0.1)
	})

	let fontSizes = [0.03, 0.04, 0.045, 0.05, 0.07]

	let titleText = { 5: { title: 'WELFARE', subTitle: 'ENVIRONMENT + PARK' }, 4: { title: 'TECHNOLOGY', subTitle: 'SMART + ASSET' }, 3: { title: 'SUPPORT', subTitle: 'MAINTAIN + FINANCE' }, 2: { title: 'SOURCE', subTitle: 'ASSETS + FINANCE' }, 1: { title: 'EXPERTS', subTitle: 'THE TEAM' } }

	return (
		<Text font={'./fonts/Eveleth Clean Regular.otf'} ref={ref} color='white' anchorX='center' anchorY='middle' position={position} fontSize={fontSizes[index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.0075}>
			{titleText[index + 1].title}
		</Text>
	)
}

function Scene() {
	// const bufferBgRef = useRef()

	// useFrame(state => {
	// 	const t = state.clock.getElapsedTime()
	// 	bufferBgRef.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
	// 	bufferBgRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10
	// })

	return (
		<>
			<group>
				<group>
					{/* <HirecoUniverse /> */}
					{/* <Float floatIntensity={1} rotationIntensity={1}>
						<Html castShadow receiveShadow occlude='blending' transform scale={0.05}>
							<iframe title='embed' width={1280} height={500} src='https://hireco.co.uk/' frameBorder={0} />
						</Html>
					</Float> */}
				</group>
				{/* <CustomGeometryParticles count={4000} /> */}
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
