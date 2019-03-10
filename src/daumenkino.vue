<template lang="pug">
.daumenkino(:class="[`daumenkino-theme-${theme}`, {'speaker-mode': speakerMode}]", :style="style")
	slot
	.progress-bar-rail
		.progress-bar
	template(v-if="speakerMode")
		.clock {{ elapsedTime }}
</template>
<script>
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
			console.log(slide)
			return slide
		},
		nextPath () {
			const nextPath = []
			// next fragment
			if (this.activeSlide.fragments.length > 0 && this.activeSlide.shownFragments < this.activeSlide.fragments.length) {
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
		previousPath () {
			const previousPath = []
			// previous fragment
			if (this.activeSlide.fragments.length > 0 && this.activeSlide.shownFragments > 0) {
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
				const fragmentsLength = this.slides[(this.activePath[0] || 0)].nestedSlides[this.activePath[1] - 1].fragments.length
				if (this.activePath[1] !== 1 || fragmentsLength) {
					previousPath.push(this.activePath[1] - 1)
				}
				if (fragmentsLength) {
					previousPath.push(fragmentsLength)
				}
			} else if (this.activePath[0] > 0) {
				// previous slide
				// normalize path and omit trailing 0s
				const fragmentsLength = this.slides[this.activePath[0] - 1].fragments.length
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
		nextSlide () {
			return this.speakerMode && this.slides[this.activeIndex + 1]
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
				'--slides-active': this.progress
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
		changeSlide (newIndex) {
			if (!this.slides[newIndex] || this.activeIndex === newIndex) return
			/* this.activeSlide.$once('after-leave', () => {
				this.animating = false
			})
			this.animating = true */
			this.activeIndex = newIndex
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
		globalKeyHandler (event) {
			switch (event.key) {
				case ' ':
				case 'ArrowRight': {
					this.next()
					break
				}
				case 'Backspace':
				case 'ArrowLeft': {
					this.previous()
					break
				}
				case 's':
					this.toggleSpeakerMode()
					break
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
					this.changeSlide(event.data[1].activeIndex)
					this.activeSlide.updateShownFragments(event.data[1].shownFragments)
					break
				}
			}
		},
		sendState () {
			if (window === undefined) return
			const otherWindow = this._speakerWindow || (this.speakerMode && window.opener)
			if (!otherWindow) return
			otherWindow.postMessage(['updateState', {
				activeIndex: this.activeIndex,
				shownFragments: this.activeSlide.shownFragments
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
	flex-direction: column
	justify-content: center
	align-items: center
	overflow: hidden
	.slides
		flex: none
		display: flex
		justify-content: center
		align-items: center

	.progress-bar-rail
		position: absolute
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
</style>
