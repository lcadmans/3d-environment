function DragPanel() {
	const bind = useGesture({
		onDrag: ({ event, offset: [x, y] }) => {
			// event.persist()
			console.log(event)
			// set({ position: [x / aspect, -y / aspect, 0], rotation: [y / aspect, x / aspect, 0] })
		}
		// onHover: ({ hovering }) => set({ scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1] })
	})
	return <a.div {...bind()} className={` absolute z-50 w-full h-full flex items-center justify-center  bg-slate-900`}></a.div>
}

if ((scroll.offset * numPages) % 1 < 0.6 && delta * 10000 > 5) {
	// if (globalMultiplier > 0.6 && scroll.offset < activeSlide / numPages) {
	// console.log(scroll.offset)
	// console.log(globalMultiplier)
	// cameraControlsRef.current?.lerpLookAt(cameraOrbitPoints[activeSlide].x, cameraOrbitPoints[activeSlide].y, cameraOrbitPoints[activeSlide].z, 0, 0, 0, cameraOrbitPoints[activeSlide + 1].x, cameraOrbitPoints[activeSlide + 1].y, cameraOrbitPoints[activeSlide + 1].z, 0, 0, 0, 1, true)
	// activeSlide = activeSlide + 1
	// activePageString = 'page' + activeSlide
	// setActivePage(activePageString)
	// scroll.offset = activeSlide / numPages + 0.0001
	// if (scroll.offset < activeSlide - 1 / numPages) {
	// console.log(activeSlide / numPages)
	// if (globalMultiplier < 0.9) {
	// }
	// }
	// return null
}
// if (globalMultiplier > 0.6 && globalMultiplier < 1) {
// scroll.offset += 0.2
// globalMultiplier = globalMultiplier * 1.3
// if (globalMultiplier < 0.2) globalMultiplier = globalMultiplier * 0.8
// if (globalMultiplier > 0.9) {
// activeSlide += 1
// console.log(activeSlide)
// setActivePage(activePageString)
// }
// }
// console.log(activeSlide)
