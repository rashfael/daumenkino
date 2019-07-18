import Vuex from 'vuex'

const store = {
	state: {
		slides: [],
		activePath: [],
		slideScale: 1,
		speakerMode: false,
		overview: false,
		transitionDirection: '',
	},
	mutations: {
		setSlides (state, slides) {
			state.slides = slides
		},
		setActivePath (state, path) {
			let transitionDirection
			const oldPath = state.activePath.slice()
			const newPath = path.slice()
			// compensate for 0 ommission
			oldPath.push(0)
			newPath.push(0)
			while (!transitionDirection && newPath.length > 0) {
				let diff
				if (diff = oldPath.shift() - newPath.shift()) {
					transitionDirection = diff > 0 ? 'previous' : 'next'
				}
			}
			state.transitionDirection = transitionDirection
			state.activePath = path
		},
		setSpeakerMode (state, mode) {
			state.speakerMode = mode
		},
		setOverview (state, overview) {
			state.overview = overview
		}
	},
	getters: {
		activeSlide ({slides, activePath}) {
			if (slides.length === 0) return null
			const path = activePath.slice()
			let slide = slides[(path.shift() || 0)]
			if (slide.nestedSlides.length > 0) {
				slide = slide.nestedSlides[(path.shift() || 0)]
			}
			return slide
		},
		nextSlide ({speakerMode, slides}, getters) {
			if (slides.length === 0 || !speakerMode) return null
			const path = getters.computeNextPath(true)
			if (!path) return
			let slide = slides[(path.shift() || 0)]
			if (slide.nestedSlides.length > 0) {
				slide = slide.nestedSlides[(path.shift() || 0)]
			}
			return slide
		},
		nextPath (state, getters) {
			return getters.computeNextPath()
		},
		computeNextPath: ({overview, slides, activePath}, {activeSlide}) => (skipFragments) => {
			if (!activeSlide) return
			const nextPath = []
			// next fragment
			if (!overview && !skipFragments && activeSlide.fragments.length > 0 && activeSlide.shownFragments < activeSlide.fragments.length) {
				nextPath.push((activePath[0] || 0))
				if (slides[(activePath[0] || 0)].nestedSlides.length > 0) {
					nextPath.push(activePath[1] || 0)
				}
				nextPath.push(activeSlide.shownFragments + 1)
			} else if (slides[(activePath[0] || 0)].nestedSlides.length > 0 && (activePath[1] || 0) < slides[(activePath[0] || 0)].nestedSlides.length - 1) {
				// next nested slide
				nextPath.push((activePath[0] || 0))
				nextPath.push((activePath[1] || 0) + 1)
			} else if ((activePath[0] || 0) < slides.length - 1) {
				// next slide
				nextPath.push((activePath[0] || 0) + 1)
			} else {
				return null
			}
			return nextPath
		},
		previousPath ({overview, slides, activePath}, {activeSlide}) {
			if (!activeSlide) return
			const previousPath = []
			// previous fragment
			if (!overview && activeSlide.fragments.length > 0 && activeSlide.shownFragments > 0) {
				previousPath.push(activePath[0])
				// normalize path and omit trailing 0s
				if ((activeSlide.shownFragments !== 1 || activePath[1] !== 0) && slides[activePath[0]].nestedSlides.length > 0) {
					previousPath.push(activePath[1] || 0)
				}
				if (activeSlide.shownFragments !== 1) {
					previousPath.push(activeSlide.shownFragments - 1)
				}
			} else if (slides[activePath[0] || 0].nestedSlides.length > 0 && activePath[1] > 0) {
				// previous nested slide
				previousPath.push(activePath[0])
				// normalize path and omit trailing 0s
				const fragmentsLength = overview ? 0 : slides[activePath[0] || 0].nestedSlides[activePath[1] - 1].fragments.length
				if (activePath[1] !== 1 || fragmentsLength) {
					previousPath.push(activePath[1] - 1)
				}
				if (fragmentsLength) {
					previousPath.push(fragmentsLength)
				}
			} else if (activePath[0] > 0) {
				// previous slide
				// normalize path and omit trailing 0s
				const previousSlide = slides[activePath[0] - 1].nestedSlides[slides[activePath[0] - 1].nestedSlides.length - 1] || slides[activePath[0] - 1]
				const fragmentsLength = overview ? 0 : previousSlide.fragments.length
				if (activePath[0] !== 1 || slides[activePath[0] - 1].nestedSlides.length > 0 || fragmentsLength) {
					previousPath.push(activePath[0] - 1)
				}
				if (slides[activePath[0] - 1].nestedSlides.length > 0) {
					previousPath.push(slides[activePath[0] - 1].nestedSlides.length - 1)
				}
				if (fragmentsLength) {
					previousPath.push(fragmentsLength)
				}
			} else {
				return null
			}
			return previousPath
		}
	}
}

export default function () {
	return new Vuex.Store(store)
}
