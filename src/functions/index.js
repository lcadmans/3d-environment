export function resolveAfterSmoothTime(smoothTime) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve('resolved')
		}, smoothTime * 100)
	})
}

export async function asyncCall(smoothTime) {
	const result = await resolveAfterSmoothTime(smoothTime)
}

function lerp(x, y, a) {
	const r = (1 - a) * x + a * y
	return Math.abs(x - y) < 0.001 ? y : r
}
