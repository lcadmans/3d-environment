import React, { useEffect, useMemo, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { Tile, TilePlane, TileHtml, TilePlaneHtml } from './'
import * as THREE from 'three'
import { Sphere, Bounds, useBounds, Plane, Line } from '@react-three/drei'
import { appState } from '../../store'
import { animated, a, update, useSpring, config } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'

import { Arrow } from '../Models'

import { cameraPositionsStore } from '../../data'

export const ContentHolder = props => {
	const group = useRef()
	const subGroup = useRef()

	const activeRing = appState(state => state.activeRing, shallow)
	const getUniverseStores = appState(state => state.getUniverseStores)
	const currentView = appState(state => state.currentView)
	const fetchData = appState(state => state.fetchData, shallow)
	const updateBounds = appState(state => state.updateBounds, shallow)
	const setActiveTile = appState(state => state.setActiveTile)
	const setCurrentView = appState(state => state.setCurrentView)
	const setActiveRing = appState(state => state.setActiveTile)

	const allContent = fetchData

	const { sectionPositions } = getUniverseStores()

	useEffect(() => {
		// console.log('fetchData')
		// console.log(fetchData)
	}, [fetchData])

	const [sections, setSections] = useState(['Experts', 'Source', 'Support', 'Technology', 'Welfare'])

	return (
		<>
			<animated.mesh visible={currentView == 'page'} ref={group}>
				{/* <Plane position={[0, 10, 0]}>
					<meshStandardMaterial color='hotpink' />
				</Plane> */}
				{sections.map((a, index) => {
					let ringIndex = index + 2
					let ringName = 'ring_' + ringIndex

					const position = sectionPositions[ringName]
					const content = allContent.filter(b => b['section'] == a)

					const randomAmounts = { ring_2: 2, ring_3: 5, ring_4: 5, ring_5: 10, ring_6: 10 }
					const randomAmount = randomAmounts[ringName]

					// console.log(randomAmount)

					const randomPositionArray = useMemo(() => {
						const array = []
						for (let i = 0; i < content.length; i++) {
							array.push({ x: randomIntFromInterval(-randomAmount, randomAmount), y: randomIntFromInterval(-randomAmount, randomAmount), z: randomIntFromInterval(-randomAmount, randomAmount) })
						}
						return array
					}, [])

					return (
						<>
							<group
								position={position}
								scale={1.5}
								onClick={() => {
									setActiveRing('none')
									setCurrentView('main')
									setActiveTile(null)
									// let [endPositionX, endPositionY, endPositionZ] = [cameraPositionsStore.focus['none'].position.x, cameraPositionsStore.focus['none'].position.y, cameraPositionsStore.focus['none'].position.z]
									let [endPositionX, endPositionY, endPositionZ] = [-75, 105, 324]
									updateBounds({ position: { xPos: endPositionX, yPos: endPositionY, zPos: endPositionZ }, target: { xTar: 0, yTar: 0, zTar: 0 } })
									// setScrollControlsInitiated(false)
								}}
							>
								{/* <Arrow /> */}
							</group>
							<group position={position} key={'sectionGroup' + index} visible={activeRing === ringName}>
								<group ref={subGroup} position={[0, { ring_2: 1.5, ring_3: 4, ring_3: 6, ring_4: 10, ring_5: 15, ring_6: 20 }[activeRing], 0]}>
									<SectionTileHolder visible={activeRing === ringName} content={content} randomPositionArray={randomPositionArray} />
								</group>
							</group>
						</>
					)
				})}
			</animated.mesh>
		</>
	)
}

function SectionTileHolder(props) {
	const { content, position, visible, randomPositionArray } = props
	const activeRing = appState(state => state.activeRing)
	const ringNames = appState(state => state.ringNames)
	const currentView = appState(state => state.currentView)
	const activeTile = appState(state => state.activeTile)

	const [sectionName, setSectionName] = useState(ringNames[activeRing])

	const [activeCameraPosition, setActiveCameraPosition] = useState(cameraPositionsStore.focus[activeRing].position)

	if (!content) return

	return content.map((a, index) => {
		const { title, subtitle, description, image, id } = a

		let CTA = ''
		const contentRef = useRef()

		const [groupPosition, setGroupPosition] = useState(randomPositionArray[index])

		const linePoints = []
		const [thisPosition, setThisPosition] = useState(new THREE.Vector3(randomPositionArray[index].x, randomPositionArray[index].y, randomPositionArray[index].z))
		const [nextPosition, setNextPosition] = useState(randomPositionArray[index + 1] ? new THREE.Vector3(randomPositionArray[index + 1].x, randomPositionArray[index + 1].y, randomPositionArray[index + 1].z) : new THREE.Vector3(0, 0, 0))

		linePoints.push(thisPosition)
		linePoints.push(nextPosition)

		let randomCount = Math.floor(Math.random() * (2 - 1 + 1) + 1)
		let ratios = [
			[7, 4],
			[4, 9]
		]

		const masterGroup = useRef()

		useFrame(({ camera }) => {
			const lookAt = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)
			contentRef.current.lookAt(lookAt)
		})

		const { contentPosition } = useSpring({
			contentPosition: currentView == 'page' ? [groupPosition.x, groupPosition.y, groupPosition.z] : [0, 0, 0],
			config: config.gentle
		})

		return (
			<>
				{/* <Sphere args={[0.01, 10, 10]} key={'sphere - ' + index}>
					<meshNormalMaterial />
				</Sphere> */}
				{/* <group position={contentPosition}> */}
				{/* </group> */}
				<group ref={masterGroup}>
					<animated.mesh visible={currentView == 'page'} key={'tile - ' + index} position={contentPosition}>
						<group position={[0, 2, 0]}>{/* <Line points={linePoints} color={'white'} lineWidth={1} dashed={false} /> */}</group>

						<group ref={contentRef} position={[0, 2, 0]}>
							{/* <TilePlaneHtml id={Title} planeArgs={[...ratios[randomCount - 1], 5, 5]} imageSrc={images[0]} title={Title} subtitle={Subtitle} description={Description} cta={CTA} activeCameraPosition={activeCameraPosition} visible={visible} /> */}
							<TilePlane id={id} planeArgs={[...ratios[randomCount - 1], 5, 5]} imageSrc={image} title={title} subtitle={subtitle} description={description} cta={CTA} activeCameraPosition={activeCameraPosition} visible={visible} linePoints={linePoints} />
						</group>
					</animated.mesh>
				</group>
			</>
		)
	})
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

function randomIntFromInterval(min, max) {
	let random = Math.random() * (max - min) + min
	// console.log('before = ' + random)
	if (random < 0.075 && random > -0.075) random = random * 1.5
	// console.log('after = ' + random)
	return random
}
