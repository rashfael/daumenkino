<template lang="pug">
.daumenkino(:class="[`daumenkino-theme-${theme}`, {'speaker-mode': speakerMode, overview}]", :style="style")
	slot
	.progress-bar-rail
		.progress-bar
	template(v-if="speakerMode")
		.clock {{ elapsedTime }}
		portal-target.daumenkino-notes-portal-target(name="notes")
</template>
<script>
import isEqual from 'lodash/isEqual'

export default {
	components: {},
	props: {
		theme: {
			type: String,
			default: 'white'
		}
	},
	data () {
		return {
			animating: false,
			slides: [],
			activePath: [],
			slideScale: 1,
			speakerMode: false,
			overview: false,
			transitionDirection: '',
			startTime: Date.now(),
			currentTime: Date.now()
		}
	},
	computed: {
		activeSlide () {
			if (this.slides.length === 0) return null
			const path = this.activePath.slice()
			let slide = this.slides[(path.shift() || 0)]
			if (slide.nestedSlides.length > 0) {
				slide = slide.nestedSlides[(path.shift() || 0)]
			}
			return slide
		},
		nextSlide () {
			if (this.slides.length === 0 || !this.speakerMode) return null
			const path = this.computeNextPath(true)
			if (!path) return
			let slide = this.slides[(path.shift() || 0)]
			if (slide.nestedSlides.length > 0) {
				slide = slide.nestedSlides[(path.shift() || 0)]
			}
			return slide
		},
		nextPath () {
			return this.computeNextPath()
		},
		previousPath () {
			const previousPath = []
			// previous fragment
			if (!this.overview && this.activeSlide.fragments.length > 0 && this.activeSlide.shownFragments > 0) {
				previousPath.push(this.activePath[0])
				// normalize path and omit trailing 0s
				if (this.activeSlide.shownFragments !== 1 && this.activePath[1] !== 0 && this.slides[this.activePath[0]].nestedSlides.length > 0) {
					previousPath.push(this.activePath[1] || 0)
				}
				if (this.activeSlide.shownFragments !== 1) {
					previousPath.push(this.activeSlide.shownFragments - 1)
				}
			} else if (this.slides[(this.activePath[0] || 0)].nestedSlides.length > 0 && this.activePath[1] > 0) {
				// previous nested slide
				previousPath.push(this.activePath[0])
				// normalize path and omit trailing 0s
				const fragmentsLength = this.overview ? 0 : this.slides[(this.activePath[0] || 0)].nestedSlides[this.activePath[1] - 1].fragments.length
				if (this.activePath[1] !== 1 || fragmentsLength) {
					previousPath.push(this.activePath[1] - 1)
				}
				if (fragmentsLength) {
					previousPath.push(fragmentsLength)
				}
			} else if (this.activePath[0] > 0) {
				// previous slide
				// normalize path and omit trailing 0s
				const fragmentsLength = this.overview ? 0 : this.slides[this.activePath[0] - 1].fragments.length
				if (this.activePath[0] !== 1 || fragmentsLength) {
					previousPath.push(this.activePath[0] - 1)
				}
				if (fragmentsLength) {
					previousPath.push(fragmentsLength)
				}
			} else {
				return null
			}
			return previousPath
		},
		totalSlides () {
			return this.slides.reduce((acc, slide) => {
				acc += slide.nestedSlides.length || 1
				return acc
			}, 0)
		},
		progress () {
			let pastActive = false
			const count = (acc, slide) => {
				if (pastActive) return acc
				if (slide === this.activeSlide) {
					pastActive = true
					return acc
				}
				return acc + (slide.nestedSlides.length > 0 ? slide.nestedSlides.reduce(count, 0) : 1)
			}
			return this.slides.reduce(count, 0)
		},
		style () {
			return {
				'--slides-total': this.totalSlides,
				'--slides-active': this.progress,
				'--active-slide-x': this.activePath[0] || 0,
				'--active-slide-y': this.slides[this.activePath[0]]?.nestedSlides[this.activePath[1]] ? this.activePath[1] : 0
			}
		},
		elapsedTime () {
			const totalSeconds = Math.floor((this.currentTime - this.startTime) / 1000)
			const minutes = Math.floor(totalSeconds / 60)
			const seconds = totalSeconds % 60
			return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
		}
	},
	watch: {
		activePath () {
			this.sendState()
			this.saveURL()
		}
	},
	created () {
	},
	mounted () {
		this.$nextTick(() => {
			const children = Array.from(this.$el.children)
			this.slides = this.$children.filter(slide => slide._isSlide).sort((a, b) => children.indexOf(a.$el) - children.indexOf(b.$el))
			this.$nextTick(() => {
				this.loadURL()
			})
		})
		document.addEventListener('keydown', this.globalKeyHandler)
		window.addEventListener('message', this.globalMessageHandler)
		// report to parent
		window.opener?.postMessage(['loaded'])
		this._timerInterval = setInterval(() => this.currentTime = Date.now(), 1000)
	},
	beforeDestroy () {
		clearInterval(this._timerInterval)
		document.removeEventListener('keydown', this.globalKeyHandler)
	},
	methods: {
		// computed base functions
		computeNextPath (skipFragments) {
			const nextPath = []
			// next fragment
			if (!this.overview && !skipFragments && this.activeSlide.fragments.length > 0 && this.activeSlide.shownFragments < this.activeSlide.fragments.length) {
				nextPath.push((this.activePath[0] || 0))
				if (this.slides[(this.activePath[0] || 0)].nestedSlides.length > 0) {
					nextPath.push(this.activePath[1] || 0)
				}
				nextPath.push(this.activeSlide.shownFragments + 1)
			} else if (this.slides[(this.activePath[0] || 0)].nestedSlides.length > 0 && (this.activePath[1] || 0) < this.slides[(this.activePath[0] || 0)].nestedSlides.length - 1) {
				// next nested slide
				nextPath.push((this.activePath[0] || 0))
				nextPath.push((this.activePath[1] || 0) + 1)
			} else if ((this.activePath[0] || 0) < this.slides.length - 1) {
				// next slide
				nextPath.push((this.activePath[0] || 0) + 1)
			} else {
				return null
			}
			return nextPath
		},
		next () {
			if (this.nextPath) {
				this.transitionDirection = 'next'
				this.activePath = this.nextPath
			}
		},
		previous () {
			if (this.previousPath) {
				this.transitionDirection = 'previous'
				this.activePath = this.previousPath
			}
		},
		toggleSpeakerMode () {
			if (!this.speakerMode) {
				this._speakerWindow = window.open(window.location.pathname, 'Daumenkino Speaker Mode', 'height=900,width=1600')
			}
		},
		toggleOverview () {
			this.overview = !this.overview
		},
		globalKeyHandler (event) {
			switch (event.key) {
				case ' ':
				case 'ArrowRight': {
					event.preventDefault()
					this.next()
					break
				}
				case 'Backspace':
				case 'ArrowLeft': {
					event.preventDefault()
					this.previous()
					break
				}
				case 's': {
					event.preventDefault()
					this.toggleSpeakerMode()
					break
				}
				case 'Escape': {
					event.preventDefault()
					this.toggleOverview()
					break
				}
				case 'Enter': {
					event.preventDefault()
					this.overview = false
					break
				}
			}
		},
		// Speaker Mode Methods
		globalMessageHandler (event) {
			switch (event.data[0]) {
				case 'loaded': {
					this._speakerWindow.postMessage(['initSpeakerMode'])
					this.sendState()
					break
				}
				case 'initSpeakerMode': {
					this.speakerMode = true
					break
				}
				case 'updateState': {
					if (isEqual(this.activePath, event.data[1].activePath)) return
					this.activePath = event.data[1].activePath
					break
				}
			}
		},
		sendState () {
			if (window === undefined) return
			const otherWindow = this._speakerWindow || (this.speakerMode && window.opener)
			if (!otherWindow) return
			otherWindow.postMessage(['updateState', {
				activePath: this.activePath
			}])
		},
		loadURL () {
			this.activePath = window.location.hash.substr(1).split('/').map(n => Number(n))
		},
		saveURL () {
			window.location.hash = this.activePath.join('/')
		}
	}
}
</script>
<style lang="stylus">
.daumenkino
	position: relative
	height: 100vh
	width: 100vw
	display: flex
	overflow: hidden
	box-sizing: border-box

	.progress-bar-rail
		position: fixed
		bottom: 0
		left: 0
		width: 100vw
		height: 4px
		background-color: #CCC
		.progress-bar
			height: 4px
			width: calc((var(--slides-active) + 1) / var(--slides-total) * 100%)
			background-color: red
	.clock
		position: absolute
		top: 24px
		left: calc(50% - 10vw)
		width: 20vw
		font-size: 4vw
		text-align: center
	.daumenkino-notes-portal-target
		position: absolute
		left: 36px
		top: 60vh
	&.overview
		flex-direction: row
		padding: 50vh 50vw
</style>
