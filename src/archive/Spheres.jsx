export function Spheres(props) {
	let sphereRef = useRef()

	let masterRef = useRef()

	const activeSlide = appState(state => state.activeSlide)
	const selectSlide = appState(state => state.setActiveSlide)

	// console.log(activeSlide)
	// console.log(activeSlide)

	// if (activeSlide === 0) {
	useFrame(state => {
		const t = state.clock.getElapsedTime()
		masterRef.current.rotation.set(Math.cos(t / 8) / 8, Math.sin(t / 8) / 16, -0.2 - Math.sin(t / 3) / 20)
		masterRef.current.position.y = (1 + Math.sin(t / 1.5)) / 80
	})
	// }

	const { nodes, materials } = useGLTF('./hireco/hireco-spheres-v1.glb')

	let sphereObj = {}
	let positions = [
		[0.06, 0, 0.01],
		[-0.04, 0, 0.12],
		[-0.17, 0, -0.16],
		[0.38, 0, -0.04],
		[-0.61, 0, 0.33]
	]
	for (let i = 2; i < 7; i++) {
		let index = i - 2
		sphereObj[`ringArrow_${i}_Sphere`] = {
			position: positions[index]
		}
	}

	return (
		<>
			<group {...props} dispose={null} ref={masterRef}>
				{Object.keys(sphereObj).map((a, i) => {
					let position = sphereObj[a].position

					let sphereGroupRef = useRef()

					if (i + 1 === activeSlide)
						return (
							<>
								<group>
									<SetsModel scale={0.2} position={position} index={i} />
								</group>
							</>
						)
					return (
						<>
							{/* <group
								ref={sphereRef}
								onClick={e => {
									console.log('clicked')
									selectSlide(i + 1)
								}}
							>
								<group position={[0, 0, 0]}>
									<TextContent position={position} index={i} />
								</group>
								<SetsModel scale={0.1} position={position} index={i} />
							</group> */}
						</>
					)
				})}

				{/* <mesh castShadow  geometry={nodes.ringArrow_2_Sphere.geometry} material={materials['H ORANGE']} position={[0.06, 0, 0.01]} scale={0.01} />
			<mesh castShadow  geometry={nodes.ringArrow_3_Sphere.geometry} material={materials['H ORANGE']} position={[-0.04, 0, 0.12]} scale={0.01} />
			<mesh castShadow  geometry={nodes.ringArrow_4_Sphere.geometry} material={materials['H ORANGE']} position={[-0.17, 0, -0.16]} scale={0.01} />
			<mesh castShadow  geometry={nodes.ringArrow_5_Sphere.geometry} material={materials['H ORANGE']} position={[0.38, 0, -0.04]} scale={0.01} />
			<mesh
				ref={sphereFiveRef}
				index={1}
				onClick={e => {
					selectSlide(sphereFiveRef.current.index)
				}}
				castShadow
				
				geometry={nodes.ringArrow_6_Sphere.geometry}
				material={materials['H ORANGE']}
				position={[-0.61, 0, 0.33]}
				scale={0.01}
			/> */}
			</group>
		</>
	)
}
