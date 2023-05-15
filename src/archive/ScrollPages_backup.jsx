import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { shallow } from 'zustand/shallow'
import useRefs from 'react-use-refs'
import { animated, a } from '@react-spring/three'
import { Text, Image } from '@react-three/drei'
import { appState } from '../../store'
import { useSpring, config } from '@react-spring/three'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export function ScrollPages(props) {
	const { refs } = props
	const { pages } = refs
	// const { page1 } = pages

	const activePage = appState(state => state.activePage)
	const setActivePage = appState(state => state.setActivePage)
	const cameraOrbitPoints = appState(state => state.cameraOrbitPoints)
	const numPages = appState(state => state.numPages)

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

	// console.log('refs')
	// console.log(refs)
	// if (!activePage) return null
	// let _activePage
	// if (activePage) _activePage = activePage
	// if (!_activePage) _activePage = 'page1'

	// if (!activePage) return <></>

	return (
		<>
			{Object.values(pageContent).map((page, index) => {
				return <Page key={page.title + ' Page'} orbitPoint={cameraOrbitPoints[index + 1]} page={page} index={index} />
			})}
			{/* <Page title={pageContent[activePage].title || null} description={pageContent[activePage].description || null} /> */}
		</>
	)
}

function Page(props) {
	const { orbitPoint, page, index } = props
	console.log('page')
	console.log(page)
	const { title, description, images } = page

	if (!title || !description) return <></>

	let isIntroPage,
		isOutroPage = false

	// let image
	// if (images) image = images[0]
	// if (!image) image = '1.png'

	let image = Math.floor(Math.random() * (5 - 1 + 1) + 1) + '.jpg'
	// let image = '1' + '.png'

	// let image
	// if (images[index]) image = images[index]
	// if (!image) image = images[1]

	// console.log('images')
	// console.log(images)
	// switch (page.type) {
	// 	case 'intro':
	// 		isIntroPage = true
	// 		break
	// 	case 'outro':
	// 		isOutroPage = true
	// 		break
	// }

	const activePage = appState(state => state.activePage)
	const cameraRefInfo = appState(state => state.cameraRefInfo, shallow)
	// const activeCameraAnchor = appState(state => state.activeCameraAnchor, shallow)

	const [titleTextRef, descriptionTextRef, textGroupRef, textMaterialRef] = useRefs()

	const [mounted, setMounted] = useState(false)
	const [groupPosition, setGroupPosition] = useState(new THREE.Vector3(0, 0, 0))
	const [pageActive, setPageActive] = useState(false)
	const [nextPage, setNextPage] = useState(false)
	const [prevPage, setPrevPage] = useState(false)
	// const [activeOpacity, setActiveOpacity] = useState(0)

	useFrame(state => {
		// textGroupRef.current.quaternion.copy(camera.quaternion)
		// if (cameraRefInfo) textGroupRef.current.lookAt(cameraRefInfo)
		const time = state.clock.getElapsedTime()
		const t = time

		// if (pageActive) {
		// titleTextRef.current.material.opacity.lerp()

		// } else {
		// titleTextRef.current.material.opacity = 0
		// }
	})

	// useEffect(() => {
	// 	console.log(activeOpacity)
	// }, [activeOpacity])

	useEffect(() => {
		setMounted(true)

		// let currentPageString = 'page' + (index + 1)
		if ('page' + (index + 1) == activePage) setPageActive(true)
		else setPageActive(false)
		if ('page' + (index + 2) == activePage || 'page' + (index + 3) == activePage || 'page' + (index + 4) == activePage || 'page' + (index + 5) == activePage) setPrevPage(true)
		else setPrevPage(false)
		if ('page' + index == activePage) setNextPage(true)
		else setNextPage(false)
	}, [activePage])

	useEffect(() => {
		let x = orbitPoint.x
		let y = orbitPoint.y
		let z = orbitPoint.z

		// x = x * 0.5
		// y = y * 0.3
		// z = z * 0.4
		setGroupPosition(new THREE.Vector3(x, y, z))
		let focusPoint = new THREE.Vector3(orbitPoint.x, orbitPoint.y + 0.3 * 1.1, orbitPoint.z)
		if (textGroupRef.current) textGroupRef.current.lookAt(focusPoint)
	}, [])

	const { mountedScale } = useSpring({
		mountedScale: pageActive == true ? 1 : 0.1,
		config: config.gentle
		// delay: 100
	})
	const { activeOpacity, posYActive } = useSpring({
		activeOpacity: pageActive == true ? 1.1 : 0.2,
		posYActive: pageActive == true ? 0 : -6,
		scaleActive: pageActive == true ? 0 : 1,
		config: config.gentle
		// delay: 300
	})

	const { activeBackOpacity } = useSpring({
		activeBackOpacity: mounted && pageActive == false ? 0.1 : 0,
		config: config.gentle
		// delay: 500
	})

	// console.log(description)

	return (
		<>
			<a.mesh
				// ref={page1}
				// position={[0, 0, 0]}
				// scale={mountedScale}
				position-y={0.25}

				// position-x={-0.01}
				// opacity={0}
				// transparrent={true}
				// material-opacity={0}
			>
				<group
					position={groupPosition}
					// rotateOnAxis={[3, 3, 3]}
				>
					<group ref={textGroupRef}>
						{/* {isIntroPage ? (
							<>
								<IntroPage title={title} description={description} />
							</>
						) : (
							<></>
						)}
						{isOutroPage ? (
							<>
								<OutroPage title={title} description={description} />
							</>
						) : (
							<></>
						)} */}
						{!isOutroPage && !isOutroPage ? (
							<>
								<group
								// position-x={-0.5}
								// rotation-x={-0.1}
								// rotation-y={0.2}
								// rotation-z={-0.1}
								>
									<group>
										{index == 0 ? (
											<Text
												font={'./fonts/Eveleth Clean Thin.otf'}
												anchorX='left'
												anchorY='middle'
												position={[-0.15, 0.5, -0.3]}
												fontSize={0.02}
												outlineOffsetX={0}
												outlineOffsetY={0}
												outlineBlur={0.05}
												// color={'#ffffff'}
												// ref={titleTextRef}
											>
												{'< Drag to explore'}
												<GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} />
											</Text>
										) : (
											<></>
										)}
										<Text
											font={'./fonts/Eveleth Clean Regular.otf'}
											anchorX='left'
											anchorY='middle'
											position={[0, 0.025, 0]}
											fontSize={0.07}
											outlineOffsetX={0}
											outlineOffsetY={0}
											outlineBlur={0.05}
											// color={'#ffffff'}
											ref={titleTextRef}
										>
											{title}

											<GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} />
										</Text>
									</group>
									<group>
										<Text font={'./fonts/Eveleth Clean Thin.otf'} anchorX='left' anchorY='middle' position={[0, -0.025, 0]} fontSize={0.02} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.05} color={'#ffffff'}>
											{description}
											<GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} />
										</Text>
									</group>
									<group>
										<Text anchorX='left' anchorY='middle' position={[0, -0.075, 0]} fontSize={0.02} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.05} color={'#ffffff'}>
											si tenimusanis molorporibus autem estiaerum fuga.
											<GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} />
										</Text>
										<Text anchorX='left' anchorY='middle' position={[0, -0.1, 0]} fontSize={0.02} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.05} color={'#ffffff'}>
											Occus sitatur Lorem ipsum dolor et sium.
											<GenerateMaterial pageActive={pageActive} activeOpacity={activeOpacity} activeBackOpacity={activeBackOpacity} nextPage={nextPage} prevPage={prevPage} />
										</Text>
									</group>
								</group>
								<group
									// position={[0.3, 0, -0.05]}
									scale={0.2}
									position-z={-0.02}
									// rotation-x={-0.1}
									// rotation-y={0.2}
									// position-x={-0.5}
									// rotation-x={-0.3}
									// rotation-y={0.5}
								>
									<animated.mesh scale={mountedScale} position-y={posYActive}>
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
