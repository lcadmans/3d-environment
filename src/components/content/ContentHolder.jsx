import React, { useEffect, useRef, useState } from 'react'

import { Tile } from './'
import * as THREE from 'three'
import { Sphere } from '@react-three/drei'
import { appState } from '../../store'
import { animated, a, update, useSpring, config } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'

export const ContentHolder = props => {
	const [points, setPoints] = useState([])
	// const [data, setData] = useState(['', '', '', '', '', '', '', '', '', ''])

	const { sectionName } = props

	const group = useRef()
	const subGroup = useRef()

	// const currentView = appState(state => state.currentView, shallow)
	const activeRing = appState(state => state.activeRing)
	const getUniverseStores = appState(state => state.getUniverseStores)
	const currentView = appState(state => state.currentView)
	// const ringNames = appState(state => state.ringNames)
	// ringNames[activeRing]
	const sectionContent = appState(state => state.sectionContent)

	// const activeTile = appState(state => state.activeTile)
	const setActiveTile = appState(state => state.setActiveTile)

	// const [sectionName, setSectionName] = useState(ringNames[activeRing])
	// const sectionName = ringNames[activeRing]
	// const content = sectionContent(sectionName)
	// const [content, setContent] = useState(sectionContent(sectionName))
	const content = sectionContent(sectionName)

	const { sectionPositions } = getUniverseStores()
	const position = sectionPositions[activeRing]

	// const activeContent = sectionContent(ringNames[activeRing])
	// const [content, setContent] = useState(activeContent)

	// useEffect(() => {
	// 	if (!activeRing || activeRing == 'none') return
	// 	// console.log(activeRing)
	// 	setSectionName(ringNames[activeRing])
	// }, [activeRing])

	// useEffect(() => {
	// 	console.log('sectionName')
	// 	console.log(sectionName)
	// 	if (!sectionName) return
	// 	setContent(sectionContent(ringNames[activeRing]))
	// }, [sectionName])

	useEffect(() => {
		// if (!activeRing) return
		// console.log('ringNames')
		// console.log(ringNames[activeRing])
		// setContent(sectionContent(ringNames[activeRing]))
	}, [activeRing])

	useFrame(({ camera }) => {
		if (!group.current) return

		subGroup.current.rotation.y += 0.001
		// group.current.lookAt(camera.position)
	})

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

	// useEffect(() => {
	// console.log(activeTile)
	// }, [activeTile])

	console.log('content')
	console.log(content)
	// if (!activeRing || activeRing == 'none') return <></>
	return (
		<>
			<animated.mesh visible={currentView == 'page'} position={position} ref={group}>
				<group
					// visible={currentView == 'page'}
					// visible={true}
					// position={position}
					ref={subGroup}
				>
					{content && content.length > 0 ? <TileHolder content={content} /> : <></>}

					{/* <Sphere args={[0.01 10, 10]} ref={sphereRef}>
					<meshNormalMaterial />
				</Sphere> */}
				</group>
			</animated.mesh>
			{/* <Tile /> */}
		</>
	)
}

function TileHolder({ content }) {
	const activeRing = appState(state => state.activeRing)
	const ringNames = appState(state => state.ringNames)
	const currentView = appState(state => state.currentView)
	const [sectionName, setSectionName] = useState(ringNames[activeRing])

	if (!content) return
	return content.map((a, index) => {
		// console.log(a)
		// const { images, title, subtitle, description, cta } = a
		const { Title, Subtitle, Description, CTA } = a
		let images
		images = a['Image/Videos']
		if (!images) images = ['1.jpg']

		console.log(images)
		const contentRef = useRef()

		let randomCount = Math.floor(Math.random() * (2 - 1 + 1) + 1)
		let ratios = [
			[0.07, 0.04],
			[0.04, 0.09]
		]

		const tileName = sectionName + '_' + index

		useFrame(({ camera }) => {
			// if (!group.current) return

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
			<animated.mesh visible={currentView == 'page'} position={contentPosition} ref={contentRef} key={'tile - ' + index}>
				<group>
					<Tile id={Title} planeArgs={[...ratios[randomCount - 1], 5, 5]} imageSrc={images[0]} title={Title} subtitle={Subtitle} description={Description} cta={CTA} />
				</group>
			</animated.mesh>
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
