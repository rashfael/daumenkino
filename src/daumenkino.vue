<template lang="pug">
.daumenkino(:class="[`daumenkino-theme-${theme}`]", :style="style")
	.slides(ref="slides", :style="slidesStyle")
		slot
	.progress-bar-rail
		.progress-bar
</template>
<script>
const SLIDE_WIDTH = 960
const SLIDE_HEIGHT = 700

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
			slideScale: 1
		}
	},
	computed: {
		activeSlide () {
			return this.slides[this.activeIndex]
		},
		style () {
			return {
				'--slides-total': this.slides.length,
				'--slides-active': this.activeIndex
			}
		},
		slidesStyle () {
			if (!this.slides) return
			return {
				transform: `scale(${this.slideScale})`
			}
		}
	},
	created () {
	},
	mounted () {
		const children = Array.from(this.$refs.slides.children)
		this.slides = this.$children.filter(slide => slide._isSlide).sort((a, b) => children.indexOf(a.$el) - children.indexOf(b.$el))

		document.addEventListener('keydown', this.globalKeyHandler)
		window.addEventListener('resize', this.computeScale)
	},
	beforeDestroy () {
		document.removeEventListener('keydown', this.globalKeyHandler)
		window.removeEventListener('resize', this.computeScale)
	},
	methods: {
		computeScale () {
			const width = this.$el.offsetWidth
			const height = this.$el.offsetHeight
			this.slideScale = Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT)
		},
		changeSlide (newIndex) {
			if (!this.slides[newIndex]) return
			this.activeSlide.$once('after-leave', () => {
				this.animating = false
			})
			this.animating = true
			this.activeIndex = newIndex
		},
		next () {
			if (this.activeSlide.shownFragments < this.activeSlide.fragments.length) {
				this.activeSlide.showNextFragment()
			} else {
				this.changeSlide(this.activeIndex + 1)
			}
		},
		previous () {
			if (this.activeSlide.shownFragments > 0) {
				this.activeSlide.showPreviousFragment()
			} else {
				this.changeSlide(this.activeIndex - 1)
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
			}
		}
	}
}
</script>
<style lang="stylus">
.daumenkino
	height: 100vh
	width: 100vw
	display: flex
	flex-direction: column
	justify-content: center
	align-items: center
	overflow: hidden
	.slides
		width: 960px
		height: 700px
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

.slide-next-enter-active, .slide-next-leave-active
	transition: opacity .3s

.slide-next-enter, .slide-next-leave-to
	opacity: 0

</style>
