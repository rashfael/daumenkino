<template lang="pug">
transition(:name="`slide-${direction}`", @after-leave="afterLeave")
	.daumenkino-slide(v-show="active || next", :class="{next}", :style="style")
		slot
</template>
<script>
const SLIDE_WIDTH = 960
const SLIDE_HEIGHT = 700
export default {
	components: {},
	data () {
		return {
			fragments: [],
			showFragments: 0,
			scale: 1
		}
	},
	computed: {
		active () {
			return !this.$parent.animating && this.$parent.activeSlide === this
		},
		next () {
			return this.$parent.nextSlide === this
		},
		style () {
			const speakerFactor = this.$parent.speakerMode ? (this.next ? 0.5 : 0.5) : 1
			return {
				'--scale': this.scale * speakerFactor
			}
		},
		shownFragments () {
			return this.next ? this.fragments.length : this.showFragments
		},
		direction () {
			return this.$parent.transitionDirection
		}
	},
	watch: {
		shownFragments () {
			this.$parent.sendState()
		}
	},
	created () {
		this._isSlide = true
	},
	mounted () {
		const fragments = []
		const unorderedFragments = this.$children.filter(slide => slide._isFragment)
		const unorderedFragmentsEls = unorderedFragments.map(c => c.$el)
		const orderByDOM = function (children) {
			if (!children) return
			for (const child of children) {
				const index = unorderedFragmentsEls.indexOf(child)
				if (index >= 0) {
					fragments.push(unorderedFragments[index])
				}
				orderByDOM(child.children)
			}
		}
		orderByDOM(this.$el.children)
		this.fragments = fragments

		window.addEventListener('resize', this.computeScale)
		this.computeScale()
	},
	beforeDestroy () {
		window.removeEventListener('resize', this.computeScale)
	},
	methods: {
		computeScale () {
			const width = document.body.offsetWidth
			const height = document.body.offsetHeight
			this.scale = Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT)
		},
		afterLeave () {
			this.$emit('after-leave')
		},
		updateShownFragments (showFragments) {
			this.showFragments = showFragments
		},
		showNextFragment () {
			this.showFragments++
		},
		showPreviousFragment () {
			this.showFragments--
		}
	}
}
</script>
<style lang="stylus">
.daumenkino-slide
	position: absolute
	width: 960px
	height: 700px
	display: flex
	flex-direction: column
	justify-content: center
	align-items: center
	transform: scale(var(--scale)) translateZ(0)
	.daumenkino-fragment:not(.daumenkino-fragment-show)
		visibility: hidden
.speaker-mode
	.daumenkino-slide
		border: 2px solid #CCC
		top: calc(16px - 350px + 350px * var(--scale))
		&:not(.next)
			left: calc(16px - 480px + 480px * var(--scale))
		&.next
			right: calc(16px - 480px + 480px * var(--scale))

.daumenkino:not(.speaker-mode)
	.slide-next-enter-active, .slide-next-leave-active, .slide-previous-enter-active, .slide-previous-leave-active
		transition: transform .5s ease

	.slide-next-enter, .slide-previous-leave-to
		transform: translateX(100vw)
	.slide-next-leave-to, .slide-previous-enter
		transform: translateX(-100vw)
</style>
