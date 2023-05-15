function TextContent({ position, index }) {
	if (index > 4) return null
	const ref = useRef()
	useFrame(({ camera }) => {
		// Make text face the camera
		ref.current.quaternion.copy(camera.quaternion)
		// Animate font color
		// ref.current.material.color.lerp(color.set(hovered ? '#fa2720' : 'white'), 0.1)
	})

	console.log(index)

	let fontSizes = [0.02, 0.03, 0.04, 0.05, 0.06]

	let titleText = { 5: { title: 'WELFARE', subTitle: 'ENVIRONMENT + PARK' }, 4: { title: 'TECHNOLOGY', subTitle: 'SMART + ASSET' }, 3: { title: 'SUPPORT', subTitle: 'MAINTAIN + FINANCE' }, 2: { title: 'SOURCE', subTitle: 'ASSETS + FINANCE' }, 1: { title: 'EXPERTS', subTitle: 'THE TEAM' } }

	return (
		<Text font={'./fonts/Eveleth Clean Regular.otf'} ref={ref} color='white' anchorX='center' anchorY='middle' position={position} fontSize={fontSizes[index]} outlineOffsetX={0} outlineOffsetY={0} outlineBlur={0.0075}>
			{titleText[index + 1].title}
		</Text>
	)
}
