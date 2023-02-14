import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const appState = create(
	devtools(set => ({
		bears: 0,
		activeSlide: 0,
		setActiveSlide: index => set(state => ({ activeSlide: index })),
		increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
		removeAllBears: () => set({ bears: 0 })
	}))
)
