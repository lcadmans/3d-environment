import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { useGLTF } from '@react-three/drei'

import { cmsData } from '../data'
import * as THREE from 'three'

const ringNames = { ring_2: 'Experts', ring_3: 'Source', ring_4: 'Support', ring_5: 'Technology', ring_6: 'Welfare' }

const activeFiles = [
	'600x400_RIGID_BRANDED.jpg',
	'0c5758c9-node_pladis_logo_RGB_red_72ppi_Transparent_In_association1_Medium.png',
	'1.jpg',
	'9fc4eb_4fe0f0e738e14b6bae0b5a7a81aff851.webp',
	'600x400_BOX_BRANDED.jpg',
	'600x400_BRANDED MAN TRUCK.jpg',
	'600x400_CURTAINSIDER_BRANDED.jpg',
	'600x400_DOUBLE DECK_BRANDED.jpg',
	'600x400_FLATBED.jpg',
	'600x400_REFRIGERATED.jpg',
	'600x400_SKEL.jpg',
	'600x400_VANS DROP N GO.jpg',
	'600x400_VANS PEUGEOT UTILITYjpg.jpg',
	'600x400_VANS VW CHILLER.jpg',
	'600x400_VANS VW PANEL.jpg',
	'600x400_VANS WELFARE.jpg',
	'1200px-B_Q_company_logo.svg.png',
	'187699729.jpg.gallery.jpg',
	'Dennison-Trailers_1000x500.webp',
	'DJI_20230213_120755_942.JPG',
	'DJI_20230213_120925_582.jpg',
	'DJI_20230213_120927_900.JPG',
	'don-bur-logo-svg.svg',
	'download.png',
	'dummy.mp4',
	'EXPERTS_CHRIS HEATHER.jpg',
	'experts_dummy.jpeg',
	'EXPERTS_DUMMY.jpg',
	'EXPERTS_JAMES SMITH.jpg',
	'EXPERTS_JASON CHIPCHASE.jpg',
	'EXPERTS_KAREN McCHESNEY.jpg',
	'EXPERTS_PAUL JEFFERY.jpg',
	'EXPERTS_SCOTT MCMINIGLE.jpg',
	'EXPERTS_TIM GIBSON.jpg',
	'EXPERTS_TIM MCARTHY.jpg',
	'Flatbed-2 copy.jpg',
	'GA_Logo_Menu.png',
	'Krone_logo.webp',
	'Lawrence-David-Logo.jpeg',
	'logo-share.png',
	'MAN_logo_logotype_emblem_symbol.jpeg',
	'Mercedes-Logo.svg.png',
	'MULTIPLE VANS.MP4',
	'Play.png',
	'Premier_Foods_logo.svg',
	'Sainsbury’s-Logo.png',
	'SDC-Trailers-Logo-RGB.jpeg',
	'Tesco_Logo.svg.png',
	'Volvo_Trucks___Bus_logo.jpeg',
	'woodland-logo-blue.png',
	'XPO_logistics.5c659fd72fa20.jpeg'
]

export const appState = create(
	devtools(set => ({
		// States
		started: false,
		activeSlide: 0,
		// activeRing: 'pageSection',
		// activeRing: 'ring_2',
		activeRing: 'none',
		focusRing: 'none',
		numPages: 4,
		activePage: null,
		activePageNumber: null,
		currentView: 'main',
		// currentView: 'page',
		isAnimating: false,
		universeStores: null,
		cameraRefInfo: null,
		activeCameraAnchor: null,
		cameraOrbitPoints: generateCirclePoints(1.1, 7, 0.6),
		returnCameraToOrigin: null,
		forcePageUpdate: false,
		cameraControlsMouseButtons: { left: 1, middle: 8, right: 2, wheel: 8 },
		dimensions: { width: window.innerWidth, height: window.innerHeight },
		scrollControlsInitiated: false,
		activeTile: null,
		activeTileInfo: null,
		cameraControlsref: null,
		activeTileRef: null,
		focusElementRef: null,
		updateBounds: null,
		activeFiles: activeFiles,

		// Set States
		setActiveSlide: index => set(state => ({ activeSlide: index })),
		setActiveRing: index => set(state => ({ activeRing: index })),
		setFocusRing: index => set(state => ({ focusRing: index })),
		setNumPages: index => set(state => ({ numPages: index })),
		setActivePage: index => set(state => ({ activePage: index })),
		setActivePageNumber: index => set(state => ({ activePageNumber: index })),
		setCurrentView: index => set(state => ({ currentView: index })),
		setIsAnimating: input => set(state => ({ isAnimating: input })),
		setStarted: input => set(state => ({ started: input })),
		setUniverseStores: input => set(state => ({ universeStores: input })),
		setCameraRefInfo: input => set(state => ({ cameraRefInfo: input })),
		setActiveCameraAnchor: input => set(state => ({ activeCameraAnchor: input })),
		setCameraOrbitPoints: input => set(state => ({ cameraOrbitPoints: input })),
		setReturnCameraToOrigin: input => set(state => ({ returnCameraToOrigin: input })),
		setForcePageUpdate: input => set(state => ({ forcePageUpdate: input })),
		setCameraControlsMouseButtons: input => set(state => ({ cameraControlsMouseButtons: input })),
		setDimensions: input => set(state => ({ dimensions: input })),
		setScrollControlsInitiated: input => set(state => ({ scrollControlsInitiated: input })),
		setActiveTile: input => set(state => ({ activeTile: input })),
		setCameraControlsref: input => set(state => ({ cameraControlsref: input })),
		setActiveTileInfo: input => set(state => ({ activeTileInfo: input })),
		setActiveTileRef: input => set(state => ({ activeTileRef: input })),
		setFocusElementRef: input => set(state => ({ focusElementRef: input })),
		setUpdateBounds: input => set(state => ({ updateBounds: input })),

		// Content
		ringNames: ringNames,
		// fetchData: null,
		// fetchData: processData(cmsData),
		fetchData: null,
		mockData: null,
		setFetchData: input => set(state => ({ fetchData: input })),

		// functions
		generateCirclePoints: (radius, segments, yElevation) => generateCirclePoints(radius, segments, yElevation),
		getUniverseStores: () => getUniverseStores()
	}))
)

// const cameraPositionsStore = {}

function generateCirclePoints(radius, segments, yElevation = 0) {
	const points = []
	for (let i = 0; i < segments; i++) {
		const angle = (i / segments) * Math.PI * 2
		// let point = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
		let point = new THREE.Vector3(Math.cos(angle) * radius, yElevation, Math.sin(angle) * radius)
		points.push(point)
	}
	return points
}

// Unvierse Stores from Zustand State Management
const getUniverseStores = () => {
	let colorValues = []
	let baseValues = [0.831, 0.25, 0.007]
	for (let i = 0; i < 15; i++) {
		let row = []
		row.push(baseValues[0] * i)
		row.push(baseValues[1] * i)
		row.push(baseValues[2] * i)
		colorValues.push(row)
	}
	const universeMultipliers = {}

	const fectchSectionPositions = () => {
		const { nodes, materials } = useGLTF('./models/hireco_3DScene_sectLocation-v3.glb')
		let sectPositions = {}

		Object.keys(nodes).forEach(a => {
			let b = nodes[a]
			b.name = b.name.replace('_location', '')

			if (b.type == 'Mesh') sectPositions[b.name] = b.position
		})
		return sectPositions
	}
	const sectionPositions = fectchSectionPositions()

	return { colorValues, universeMultipliers, sectionPositions }
}

useGLTF.preload('./models/hireco_3DScene_sectLocation-v3.glb')

function processData(data) {
	let arr = []

	data.items.forEach(a => {
		// console.log(a)
		let row = {}
		const { fields, metadata, sys } = a
		// console.log(fields)
		let { title, subtitle, description, image, otherImages } = fields
		let section = sys.contentType.sys.id
		description = description.content[0]
		if (description.content[0].value) description = description.content[0].value
		else description = ''

		// console.log(description)
		// console.log(section)

		row['title'] = title
		row['subtitle'] = subtitle
		row['description'] = description
		row['image'] = image
		row['section'] = toTitleCase(section)
		row['otherImages'] = otherImages

		arr.push(row)
	})
	return arr
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	})
}
