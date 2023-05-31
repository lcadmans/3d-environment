import React, { useEffect, useRef, useState } from 'react'

import { Tile, TilePlane, TileHtml } from './'
import * as THREE from 'three'
import { Sphere, Bounds, useBounds } from '@react-three/drei'
import { appState } from '../../store'
import { animated, a, update, useSpring, config } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'

import { cameraPositionsStore } from '../../data'

export const ContentHolder = props => {
	const [points, setPoints] = useState([])

	const { sectionName } = props

	const group = useRef()
	const subGroup = useRef()

	const activeRing = appState(state => state.activeRing)
	const getUniverseStores = appState(state => state.getUniverseStores)
	const currentView = appState(state => state.currentView)
	const sectionContent = appState(state => state.sectionContent)
	const allContent = appState(state => state.allContent)

	const activeTile = appState(state => state.activeTile)
	const setActiveTile = appState(state => state.setActiveTile)

	// const content = sectionContent(sectionName)
	const content = allContent

	const { sectionPositions } = getUniverseStores()

	useFrame(({ camera }) => {
		if (!group.current) return

		if (!activeTile) subGroup.current.rotation.y += 0.0005
		else subGroup.current.rotation.y = subGroup.current.rotation.y
		// group.current.lookAt(camera.position)
	})

	function randomIntFromInterval(min, max) {
		let random = Math.random() * (max - min) + min
		// console.log('before = ' + random)
		if (random < 0.075 && random > -0.075) random = random * 1.5
		// console.log('after = ' + random)
		return random
	}

	const [sections, setSections] = useState(['Experts', 'Source', 'Support', 'Technology', 'Welfare'])

	return (
		<>
			<animated.mesh visible={currentView == 'page'} ref={group}>
				{sections.map((a, index) => {
					let ringIndex = index + 2
					let ringName = 'ring_' + ringIndex

					const position = sectionPositions[ringName]
					const content = allContent.filter(b => b['Category'] == a)

					// console.log(position)

					// console.log(content)

					// console.log(activeRing)
					// console.log(ringName)

					return (
						<group position={position} key={'sectionGroup' + index} visible={activeRing === ringName}>
							<group ref={subGroup}>
								<SectionTileHolder visible={activeRing === ringName} content={content} />
							</group>
						</group>
					)
				})}
			</animated.mesh>
		</>
	)
}

function SectionTileHolder({ content, position, visible }) {
	const activeRing = appState(state => state.activeRing)
	const ringNames = appState(state => state.ringNames)
	const currentView = appState(state => state.currentView)
	const activeTile = appState(state => state.activeTile)

	const [sectionName, setSectionName] = useState(ringNames[activeRing])

	const [activeCameraPosition, setActiveCameraPosition] = useState(cameraPositionsStore.focus[activeRing].position)

	if (!content) return

	return content.map((a, index) => {
		const { Title, Subtitle, Description, CTA } = a
		let images
		images = a['Image/Videos'].split(',')
		if (images[0].length < 1) images = ['1.jpg']
		const contentRef = useRef()

		let randomCount = Math.floor(Math.random() * (2 - 1 + 1) + 1)
		let ratios = [
			[0.07, 0.04],
			[0.04, 0.09]
		]

		const tileName = sectionName + '_' + index

		const masterGroup = useRef()

		useFrame(({ camera }) => {
			// if (!group.current) return
			if (!activeTile) masterGroup.current.rotation.y += 0.001
			const lookAt = new THREE.Vector3(camera.position.x, camera.position.y + 0.1, camera.position.z)
			// contentRef.current.lookAt(lookAt)
		})

		const [groupPosition, setGroupPosition] = useState({ x: randomIntFromInterval(-0.125, 0.125), y: randomIntFromInterval(-0.125, 0.125), z: randomIntFromInterval(-0.125, 0.125) })

		const { contentPosition } = useSpring({
			contentPosition: currentView == 'page' ? [groupPosition.x, groupPosition.y, groupPosition.z] : [0, 0, 0],
			config: config.gentle
		})

		// console.log(x)

		return (
			<>
				{/* <Sphere args={[0.01, 10, 10]} key={'sphere - ' + index}>
					<meshNormalMaterial />
				</Sphere> */}
				<group ref={masterGroup}>
					<animated.mesh visible={currentView == 'page'} key={'tile - ' + index} position={contentPosition}>
						<group ref={contentRef} position={[0, 0.3, 0]}>
							<TileHtml id={Title} planeArgs={[...ratios[randomCount - 1], 5, 5]} imageSrc={images[0]} title={Title} subtitle={Subtitle} description={Description} cta={CTA} activeCameraPosition={activeCameraPosition} visible={visible} />
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
