import React, { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { appState } from '../store'

export function ConsoleLogger() {
	const activeRing = appState(state => state.activeRing)
	const currentView = appState(state => state.currentView)
	const activePage = appState(state => state.activePage)
	const activeTile = appState(state => state.activeTile)
	const scrollControlsInitiated = appState(state => state.scrollControlsInitiated, shallow)

	let table = {}

	table.activeRing = activeRing
	table.currentView = currentView
	table.activePage = activePage
	table.scrollControlsInitiated = scrollControlsInitiated
	table.activeTile = activeTile

	useEffect(() => {
		console.table(table)
	}, [table])
	return <></>
}
