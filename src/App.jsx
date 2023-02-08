import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Model } from './Model'

import './styles/global.css'

function ModelComponent(props) {
	// This reference will give us direct access to the mesh
	const mesh = useRef()
	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false)
	const [active, setActive] = useState(false)
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (mesh.current.rotation.y += delta))
	// Return view, these are regular three.js elements expressed in JSX
	return (
		<mesh {...props} ref={mesh} scale={0.25}>
			{/* <boxGeometry args={[1, 1, 1]} /> */}
			<Model />
			{/* <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} /> */}
		</mesh>
	)
}

function App() {
	return (
		<div className='App' style={{ height: '100vh' }}>
			{/* <h1>Geez</h1> */}
			<Canvas height={'100vh'}>
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				{/* <Box position={[-1.2, 0, 0]} /> */}
				<ModelComponent position={[0, -1.5, 0]} />
			</Canvas>
		</div>
	)
}

export default App
