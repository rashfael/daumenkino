<template lang="pug">
.daumenkino(:class="[`daumenkino-theme-${theme}`, {'speaker-mode': speakerMode}]", :style="style")
	slot
	.progress-bar-rail
		.progress-bar
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
			activeIndex: 0,
			slideScale: 1,
			speakerMode: false,
			transitionDirection: ''
		}
	},
	computed: {
		activeSlide () {
			return this.slides[this.activeIndex]
		},
		nextSlide () {
			return this.speakerMode && this.slides[this.activeIndex + 1]
		},
		style () {
			return {
				'--slides-total': this.slides.length,
				'--slides-active': this.activeIndex
			}
		},

	},
	watch: {
		activeIndex: 'sendState'
	},
	created () {
	},
	mounted () {
		const children = Array.from(this.$el.children)
		this.slides = this.$children.filter(slide => slide._isSlide).sort((a, b) => children.indexOf(a.$el) - children.indexOf(b.$el))

		document.addEventListener('keydown', this.globalKeyHandler)
		window.addEventListener('message', this.globalMessageHandler)

		// report to parent
		window.opener?.postMessage(['loaded'])
	},
	beforeDestroy () {
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
			if (this.activeSlide.shownFragments < this.activeSlide.fragments.length) {
				this.activeSlide.showNextFragment()
			} else {
				this.transitionDirection = 'next'
				this.changeSlide(this.activeIndex + 1)
			}
		},
		previous () {
			if (this.activeSlide.shownFragments > 0) {
				this.activeSlide.showPreviousFragment()
			} else {
				this.transitionDirection = 'previous'
				this.changeSlide(this.activeIndex - 1)
			}
		},
		toggleSpeakerMode () {
			if (!this.speakerMode) {
				this._speakerWindow = window.open('/', 'Daumenkino Speaker Mode', 'height=700,width=960')
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
			const otherWindow = this._speakerWindow || (this.speakerMode && window.opener)
			if (!otherWindow) return
			otherWindow.postMessage(['updateState', {
				activeIndex: this.activeIndex,
				shownFragments: this.activeSlide.shownFragments
			}])
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
</style>
