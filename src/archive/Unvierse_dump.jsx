function remap(x, [low1, high1], [low2, high2]) {
	return low2 + ((x - low1) * (high2 - low2)) / (high1 - low1)
}
const computeUpness = geometry => {
	const { array, count } = geometry.attributes.normal
	const arr = Float32Array.from({ length: count })

	const normalVector = new Vector3()
	const up = new Vector3(0, 1, 0)

	for (let i = 0; i < count; i++) {
		const n = array.slice(i * 3, i * 3 + 3)
		normalVector.set(n[0], n[1], n[2])

		const dot = normalVector.dot(up)
		const value = dot > 0.4 ? remap(dot, [0.4, 1], [0, 1]) : 0
		arr[i] = Number(value)
	}

	return new BufferAttribute(arr, 1)
}

{
	/* <Sampler
						count={20000}
						// mesh={randomMeshRef}
						weight='upness'
						transform={transformInstances}
					> */
}
{
	/* <Sampler count={20000} mesh={ringRef} instances={ringInstanceRef} transform={transformInstances} /> */
}
{
	/* <mesh
							ref={randomMeshRef}
						>
							<primitive attach='geometry' {...randomNodes.ring_6_6.geometry} weight='upness'>
								<ComputedAttribute name='upness' compute={computeUpness} />
							</primitive>
							<meshPhysicalMaterial transparent {...config} />
						</mesh> */
}
{
	/* <instancedMesh args={[null, null, 20000]} ref={randomInstancesRef}>
							<sphereGeometry args={[0.0004, 1, 1]} />
							<meshBasicMaterial color={colorValues[9]} emissiveIntensity={2} toneMapped={false}></meshBasicMaterial>
						</instancedMesh>
					</Sampler> */
}

{
	/* <Sampler count={500} weight='upness' transform={transformInstances}>
						<mesh>
							<torusKnotGeometry>
								<ComputedAttribute name='upness' compute={computeUpness} />
							</torusKnotGeometry>
							<meshNormalMaterial />
						</mesh>
						<instancedMesh args={[null, null, 1_000]}>
							<sphereGeometry args={[0.1, 32, 32, Math.PI / 2]} />
							<meshNormalMaterial />
						</instancedMesh>
					</Sampler> */
}
