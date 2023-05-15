/**
 * Passes mesh as ref and instancedMesh as child
 */
function MixedAPI(props) {
	const sampledMesh = useRef()
	const { nodes } = useGLTF(suzanne)

	return (
		<>
			<mesh ref={sampledMesh} {...props}>
				<primitive object={nodes.Suzanne.geometry} attach='geometry'>
					<ComputedAttribute name='upness' compute={computeUpness} usage={StaticReadUsage} />
				</primitive>
				<LayerMaterial color='#2e0027' lighting='physical' envMapIntensity={0.1} />
			</mesh>

			<SurfaceSampler transform={transformInstance} mesh={sampledMesh}>
				<instancedMesh args={[null, null, 100_000]}>
					<myGeometry args={[undefined, undefined, 2]} />
					<LayerMaterial color='#2e0027' lighting='physical' envMapIntensity={0.5}>
						<Depth colorA='#2e0027' colorB='#ffd0d0' near={0.12} far={2} mapping={'world'} />
					</LayerMaterial>
				</instancedMesh>
			</SurfaceSampler>
		</>
	)
}
function Hireco_sampled(props) {
	// const { geom } = props
	const sampledMesh = useRef()

	const { nodes, materials } = useGLTF('./models/hireco_3DScene_v10.glb')

	return (
		<>
			<mesh ref={sampledMesh} {...props}>
				{/* {Object.keys(nodes).map(node => {
					console.log('node')
					console.log(nodes[node])
					let geom = nodes[node].geometry
					// node = nodes[node]
					console.log(geom)

					return (
						<>
							<primitive object={geom} attach='geometry'>
								<ComputedAttribute name='upness' compute={computeUpness} usage={StaticReadUsage} />
							</primitive>
						</>
					)
				})} */}

				<primitive object={nodes.ring_6.geometry} attach='geometry'>
					<ComputedAttribute name='upness' compute={computeUpness} usage={StaticReadUsage} />
				</primitive>

				<LayerMaterial color='#2e0027' lighting='physical' envMapIntensity={0.1} />
			</mesh>

			<SurfaceSampler transform={transformInstance} mesh={sampledMesh}>
				<instancedMesh args={[null, null, 100_000]}>
					<myGeometry args={[undefined, undefined, 2]} />
					<LayerMaterial color='#2e0027' lighting='physical' envMapIntensity={0.5}>
						<Depth colorA='#2e0027' colorB='#ffd0d0' near={0.12} far={2} mapping={'world'} />
					</LayerMaterial>
				</instancedMesh>
			</SurfaceSampler>
		</>
	)
}

useGLTF.preload('./models/hireco_3DScene_v10.glb')

const computeUpness = geometry => {
	const { array, count } = geometry.attributes.normal
	const arr = Float32Array.from({ length: count })

	const normalVector = new Vector3()
	const up = new Vector3(0, 1, 0)

	for (let i = 0; i < count; i++) {
		const n = array.slice(i * 3, i * 3 + 3)
		normalVector.set(n[0], n[1], n[2])

		const value = normalVector.dot(up) > 0.4
		arr[i] = Number(value)
	}

	return new BufferAttribute(arr, 1)
}

const ComputedAttribute = ({ compute, name, ...props }) => {
	const [bufferAttribute] = useState(() => new BufferAttribute(new Float32Array(0), 1))
	const primitive = React.useRef()

	React.useLayoutEffect(() => {
		const attr = compute(primitive.current.__r3f.parent)
		primitive.current.copy(attr)
	}, [compute])

	return <primitive ref={primitive} object={bufferAttribute} attachObject={['attributes', name]} {...props} />
}

const SurfaceSampler = ({ children, weight, transform, instances, mesh, ...props }) => {
	const group = useRef(null)
	const instancedRef = useRef(null)
	const meshToSampleRef = useRef(null)

	useEffect(() => {
		instancedRef.current = instances?.current ?? group.current.children.find(c => c.hasOwnProperty('instanceMatrix'))

		meshToSampleRef.current = mesh?.current ?? group.current.children.find(c => c.type === 'Mesh')
	}, [])

	const doSampling = () => {
		if (typeof meshToSampleRef.current === 'undefined') return
		if (typeof instancedRef.current === 'undefined') return

		const sampler = new MeshSurfaceSampler(meshToSampleRef.current)

		if (weight) {
			sampler.setWeightAttribute(weight)
		}

		sampler.build()

		const position = new Vector3()
		const normal = new Vector3()
		const color = new Color()

		const dummy = new Object3D()

		meshToSampleRef.current.updateMatrixWorld(true)

		for (let i = 0; i < instancedRef.current.count; i++) {
			sampler.sample(position, normal, color)

			if (typeof transform === 'function') {
				transform(
					{
						dummy,
						sampledMesh: meshToSampleRef.current,
						position,
						normal,
						color
					},
					i
				)
			} else {
				dummy.position.copy(position)
			}

			dummy.updateMatrix()

			instancedRef.current.setMatrixAt(i, dummy.matrix)
		}

		instancedRef.current.instanceMatrix.needsUpdate = true
	}

	useEffect(() => {
		doSampling()
	}, [])

	return (
		<group ref={group} {...props}>
			{children}
		</group>
	)
}

const transformInstance = ({ dummy, sampledMesh, position, normal }) => {
	dummy.scale.setScalar(Math.random() * 0.01)

	const worldPosition = sampledMesh.localToWorld(position)
	dummy.position.copy(worldPosition)

	dummy.lookAt(normal.clone().add(position))
	dummy.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
	dummy.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
	dummy.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
}
