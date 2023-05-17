import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { shallow } from 'zustand/shallow'
import useRefs from 'react-use-refs'
import { animated, a } from '@react-spring/three'
import { Text, Image, Sphere } from '@react-three/drei'
import { appState } from '../../store'
import { useSpring, config } from '@react-spring/three'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export function ScrollPages(props) {
	const { groupProps } = props
	// console.log(groupProps)
	// const { refs } = props

	const currentView = appState(state => state.currentView)
	const generateCirclePoints = appState(state => state.generateCirclePoints)
	const [circlePoints, setCirclePoints] = useState(generateCirclePoints(1, 8, 0.1))

	const [groupPositions, setGroupPositions] = useState(fetchMidPoints(circlePoints))

	let pageContent = {
		page2: {
			title: 'Page 2 Title',
			description: 'Page 2 Description'
			// images: []
			// layout: 'layou_3'
		},
		page3: {
			title: 'Page 3 Title',
			description: 'Page 3 Description'
			// images: []
		}
	}

	pageContent = appendOutsidePages(pageContent)

	function appendOutsidePages(input) {
		let introPage = {
			title: 'Asset Source',
			description: 'Trailer | Truck | Van | Finance',
			type: 'intro',
			images: ['1.png']
		}
		input = { introPage: introPage, ...input }
		input['outroPage'] = {
			title: 'Outro',
			description: 'Go Back',
			type: 'outro'
			// images: ['return.png']
		}

		return input
	}

	return (
		<>
			<group {...groupProps}>
				{Object.values(pageContent).map((page, index) => {
					return <Page key={page.title + ' Page'} page={page} index={index} groupPosition={groupPositions[index + 1]} />
				})}
			</group>
		</>
	)
}

function Page(props) {
	const { page, index, groupPosition } = props
	const { title, description, images } = page

	const setActivePage = appState(state => state.setActivePage)
	const activePage = appState(state => state.activePage)
	const setActivePageNumber = appState(state => state.setActivePageNumber)
	const activePageNumber = appState(state => state.activePageNumber)
	const cameraRefInfo = appState(state => state.cameraRefInfo, shallow)
	const setForcePageUpdate = appState(state => state.setForcePageUpdate)

	const [titleTextRef, descriptionTextRef, textGroupRef, textMaterialRef] = useRefs()
	const groupRef = useRef()
	const [page1Ref] = useRefs()

	const [mounted, setMounted] = useState(false)
	const [pageActive, setPageActive] = useState(false)
	const [nextPage, setNextPage] = useState(false)
	const [prevPage, setPrevPage] = useState(false)

	let isIntroPage,
		isOutroPage = false

	let image = Math.floor(Math.random() * (5 - 1 + 1) + 1) + '.jpg'

	useEffect(() => {
		// setMounted(true)
		if ('page' + (index + 1) == activePage) setPageActive(true)
		else setPageActive(false)
		if ('page' + (index + 2) == activePage || 'page' + (index + 3) == activePage || 'page' + (index + 4) == activePage || 'page' + (index + 5) == activePage) setPrevPage(true)
		else setPrevPage(false)
		if ('page' + index == activePage) setNextPage(true)
		else setNextPage(false)
	}, [activePage])

	const { mountedScale } = useSpring({
		mountedScale: pageActive == true ? 1 : 0.7,
		config: config.gentle
		// delay: 100
	})

	const { activeOpacity, posYActiveImage, posYActiveGroup } = useSpring({
		activeOpacity: pageActive == true ? 1.1 : 0.025,
		posYActiveImage: pageActive == true ? 0.1 : 0.2,
		posYActiveGroup: pageActive == true ? 0.5 : 0.3,
		scaleActive: pageActive == true ? 0.9 : 1,
		config: config.gentle
		// delay: 300
	})

	const { activeBackOpacity } = useSpring({
		activeBackOpacity: pageActive == false ? 0.1 : 0,
		config: config.gentle
		// delay: 500
	})

	useFrame(({ camera }) => {
		// if (!groupRef.current) return
		page1Ref.current.lookAt(camera.position)
	})

	return (
		<>
			<a.mesh position-y={posYActiveGroup} ref={groupRef} scale={0.5}>
				{/* <Sphere args={[0.02, 10, 10]} position={groupPosition} position-y={-0.5}>
					<meshNormalMaterial />
				</Sphere> */}
				<group
					position={groupPosition}
					ref={page1Ref}
					scale={1.5}
					onClick={() => {
						// console.log('page' + (index + 1))
						setForcePageUpdate(true)
						setActivePage('page' + (index + 1))
						setActivePageNumber(index + 1)
					}}
					onPointerOver={() => {
						document.body.style.cursor = 'pointer'
					}}
					onPointerOut={() => {
						document.body.style.cursor = 'default'
					}}
				>
					<group ref={textGroupRef}>
						{!isOutroPage && !isOutroPage ? (
							<>
								<group>
									<group>
										{index == 0 ? (
											<Text font={'./fonts/Eveleth Clean Thin.otf'} anchorX='left' anchorY='middle' position={[-0.2, 0.5, -0.3]} fontSize={0.02} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={1}>
												{'< Drag to explore'}
												<GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} />
											</Text>
										) : (
											<></>
										)}
										{/* <Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='center' anchorY='middle' position={[0, 0.025, 0]} fontSize={0.05} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.0175} ref={titleTextRef} color={0xffffff}>
											test
										</Text> */}
										<Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='left' anchorY='middle' position={[0, 0.025, 0]} fontSize={0.04} ref={titleTextRef} color={0xffffff} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.1}>
											{title}
											<animated.meshBasicMaterial attach='material' opacity={activeOpacity} side={THREE.FrontSide} blending={THREE.AdditiveBlending} ref={testMaterial} />
											{/* <GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} /> */}
										</Text>
									</group>
									<group>
										<Text font={'./fonts/Eveleth Clean Thin.otf'} anchorX='left' anchorY='middle' position={[0, -0.01, 0]} fontSize={0.015} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.05} color={'#ffffff'}>
											{description}
											<GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} />
										</Text>
									</group>
									<group>
										<Text anchorX='left' anchorY='middle' position={[0, -0.03, 0]} fontSize={0.015} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.05} color={'#ffffff'}>
											si tenimusanis molorporibus autem estiaerum fuga.
											<GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} />
										</Text>
										<Text anchorX='left' anchorY='middle' position={[0, -0.05, 0]} fontSize={0.015} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.05} color={'#ffffff'}>
											Occus sitatur Lorem ipsum dolor et sium.
											<GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} />
										</Text>
									</group>
								</group>
								<group scale={0.2} position-z={-0.02} position-x={-0.15} position-y={-0.075}>
									<animated.mesh scale={mountedScale} position-y={posYActiveImage}>
										<Image url={'./images/' + image} transparent opacity={0.5}></Image>
										{/* <animated.meshBasicMaterial attachArray='material' opacity={activeOpacity} side={THREE.FrontSide} blending={THREE.AdditiveBlending} /> */}
										{/* <GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} /> */}
										{/* <ImageComponent url={'./images/' + image} /> */}
									</animated.mesh>
								</group>
							</>
						) : (
							<></>
						)}
					</group>
				</group>
			</a.mesh>
		</>
	)
}

function GenerateMaterial(props) {
	const { pageActive, activeOpacity, activeBackOpacity, nextPage, prevPage } = props
	return (
		<>
			<animated.meshBasicMaterial attachArray='material' opacity={activeOpacity} side={THREE.FrontSide} blending={THREE.AdditiveBlending} />
			{/* {pageActive || nextPage ? (
				<>
					<animated.meshBasicMaterial attachArray='material' opacity={activeOpacity} side={THREE.FrontSide} blending={THREE.AdditiveBlending} />
				</>
			) : (
				<>
					<animated.meshBasicMaterial attachArray='material' opacity={activeBackOpacity} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
				</>
			)} */}
		</>
	)
}

// function IntroPage(props) {
// 	const { title, description } = props
// 	return (
// 		<>
// 			<group>
// 				<Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='left' anchorY='middle' position={[0, 0.025, 0]} fontSize={0.05} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.0575} color={'#ffffff'}>
// 					{title}
// 				</Text>
// 			</group>
// 			<group>
// 				<Text font={'./fonts/Eveleth Clean Thin.otf'} anchorX='left' anchorY='middle' position={[0, -0.025, 0]} fontSize={0.02} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.01} color={'#eda666'}>
// 					{description}
// 				</Text>
// 			</group>
// 		</>
// 	)
// }

// function OutroPage(props) {
// 	const { title, description } = props
// 	return (
// 		<>
// 			<group>
// 				<Text font={'./fonts/Eveleth Clean Regular.otf'} anchorX='left' anchorY='middle' position={[0, 0.025, 0]} fontSize={0.05} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.0575} color={'#ffffff'}>
// 					{title}
// 				</Text>
// 			</group>
// 			<group>
// 				<Text font={'./fonts/Eveleth Clean Thin.otf'} anchorX='left' anchorY='middle' position={[0, -0.025, 0]} fontSize={0.02} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.01} color={'#eda666'}>
// 					{description}
// 				</Text>
// 			</group>
// 		</>
// 	)
// }

const Texture = ({ texture }) => {
	return (
		<mesh>
			<planeBufferGeometry attach='geometry' args={[5, 4]} transparrent opacity={0} />
			<meshBasicMaterial attach='material' map={texture} />
		</mesh>
	)
}
const ImageComponent = ({ url }) => {
	const texture = useMemo(() => new THREE.TextureLoader().load(url), [url])
	return <Texture texture={texture} />
}

function fetchMidPoints(circlePoints) {
	let arr = []
	circlePoints.forEach((a, index) => {
		if (circlePoints[index + 1]) {
			let oldPosition = circlePoints[index]
			let nextPosition = circlePoints[index + 1]
			// console.log(oldPosition)
			// console.log(nextPosition)
			arr.push(oldPosition.lerp(nextPosition, 0.5))
		}
	})
	return arr
}
