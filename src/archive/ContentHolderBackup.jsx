import React, { useEffect, useRef, useState } from 'react'

import { Tile } from './'
import * as THREE from 'three'
import { Sphere } from '@react-three/drei'
import { appState } from '../../store'
import { animated, a, update, useSpring, config } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'

export const ContentHolder = () => {
	const [points, setPoints] = useState([])
	// const [data, setData] = useState(['', '', '', '', '', '', '', '', '', ''])

	const group = useRef()
	const subGroup = useRef()

	// const currentView = appState(state => state.currentView, shallow)
	const activeRing = appState(state => state.activeRing)
	const getUniverseStores = appState(state => state.getUniverseStores)
	const currentView = appState(state => state.currentView)
	const ringNames = appState(state => state.ringNames)
	const sectionContent = appState(state => state.sectionContent)

	const activeTile = appState(state => state.activeTile)
	const setActiveTile = appState(state => state.setActiveTile)

	const [sectionName, setSectionName] = useState(ringNames[activeRing])

	const { sectionPositions } = getUniverseStores()

	const position = sectionPositions[activeRing]

	const content = sectionContent('Experts')

	// useEffect(() => {
	// 	// console.log(activeRing)

	// 	let copy = sectionCopy[sectionName]
	// 	setSectionContent(copy)
	// 	setContent(copy.content)
	// }, [])

	// useEffect(() => {
	// 	setSectionContent(sectionCopy[sectionName] || [])
	// }, [activeRing])

	// useEffect(() => {
	// 	setContent(sectionContent.content)
	// }, [sectionContent])

	// useEffect(() => {
	// 	console.log(sectionName)
	// 	console.log(sectionContent)
	// }, [sectionContent])

	useFrame(({ camera }) => {
		if (!group.current) return

		subGroup.current.rotation.y += 0.001
		// group.current.lookAt(camera.position)
	})
	// useEffect(() => {
	// 	for (let i = 0; i < 100; i++) {
	// 		let _points = points
	// 		const matrix = new THREE.Matrix4()
	// 		randomizeMatrix(matrix)
	// 		_points.push(matrix)
	// 		setPoints(_points)
	// 	}
	// 	setData([...Array(20).keys()])
	// }, [])

	function randomIntFromInterval(min, max) {
		let random = Math.random() * (max - min) + min
		// console.log('before = ' + random)
		if (random < 0.075 && random > -0.075) random = random * 1.5
		// console.log('after = ' + random)
		return random
	}

	// const { groupPosition } = useSpring({
	// 	groupPosition: currentView == 'page' ? position : [0, 0, 0],
	// 	config: config.gentle
	// })

	useEffect(() => {
		// console.log(activeTile)
	}, [activeTile])

	return (
		<>
			<animated.mesh visible={currentView == 'page'} position={position} ref={group}>
				<group
					// visible={currentView == 'page'}
					// visible={true}
					// position={position}
					ref={subGroup}
				>
					{content &&
						content.content.map((a, index) => {
							const { images, title, subtitle, description, cta } = a
							const contentRef = useRef()

							useFrame(({ camera }) => {
								if (!group.current) return

								// subGroup.current.rotation.y += 0.01
								contentRef.current.lookAt(camera.position)
							})

							let x = randomIntFromInterval(-0.125, 0.125)
							let y = randomIntFromInterval(-0.125, 0.125)
							let z = randomIntFromInterval(-0.125, 0.125)

							const { contentPosition } = useSpring({
								contentPosition: currentView == 'page' ? [x, y, z] : [0, 0, 0],

								config: config.gentle
							})

							// console.log(x)

							return (
								// <Sphere args={[0.01, 10, 10]} key={'sphere - ' + index} position={[x, y, z]}>
								// 	<meshNormalMaterial />
								// </Sphere>
								<animated.mesh visible={currentView == 'page'} position={contentPosition} ref={contentRef} key={'sphere - ' + index}>
									<group
										onClick={() => {
											console.log('tileClick')
											setActiveTile(sectionName + '_' + index)
										}}
									>
										<Tile imageSrc={images[0]} title={title} subtitle={subtitle} description={description} cta={cta} />
									</group>
								</animated.mesh>
							)
						})}

					{/* <Sphere args={[0.01 10, 10]} ref={sphereRef}>
					<meshNormalMaterial />
				</Sphere> */}
				</group>
			</animated.mesh>
			{/* <Tile /> */}
		</>
	)
}

const randomizeMatrix = (function () {
	const position = new THREE.Vector3()
	const rotation = new THREE.Euler()
	const quaternion = new THREE.Quaternion()
	const scale = new THREE.Vector3()

	return function (matrix) {
		position.x = Math.random() * 40 - 20
		position.y = Math.random() * 40 - 20
		position.z = Math.random() * 40 - 20

		rotation.x = Math.random() * 2 * Math.PI
		rotation.y = Math.random() * 2 * Math.PI
		rotation.z = Math.random() * 2 * Math.PI

		quaternion.setFromEuler(rotation)

		scale.x = scale.y = scale.z = Math.random() * 1

		matrix.compose(position, quaternion, scale)
	}
})()

export default ContentHolder
