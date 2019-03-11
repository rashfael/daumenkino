<template lang="pug">
transition(:name="`slide-${direction}`", @after-leave="afterLeave")
	.daumenkino-slide(v-show="active || activeChild || nextChild || next || overview", :class="{active, next, nested}", :style="style")
		.daumenkino-slide-content
			slot
</template>
<script>
const SLIDE_WIDTH = 960
const SLIDE_HEIGHT = 700
export default {
	components: {},
	data () {
		return {
			activeChild: false,
			nextChild: false,
			nestedSlides: [],
			fragments: [],
			scale: 1
		}
	},
	computed: {
		active () {
			return this.$parent.activeSlide === this || this.$parent.$parent.activeSlide === this
		},
		next () {
			return this.$parent.nextSlide === this || this.$parent.$parent.nextSlide === this
		},
		nested () {
			return this.nestedSlides.length > 0
		},
		overview () {
			return this.$parent.overview || this.$parent.$parent.overview
		},
		style () {
			const speakerFactor = (this.$parent.speakerMode || this.$parent.$parent.speakerMode) ? (this.next ? 0.5 : 0.5) : 1
			return {
				'--scale': this.scale * speakerFactor
			}
		},
		shownFragments () {
			if (!this.active) return
			const path = this.$parent.activePath.slice()
			if (this.$parent.slides[path.shift()].nestedSlides.length > 0) {
				path.shift()
			}
			return path.shift() || 0
		},
		direction () {
			return this.$parent.transitionDirection || this.$parent.$parent.transitionDirection
		}
	},
	watch: {
		'$parent.activeSlide' () {
			this.activeChild = this.$children.some(child => child._isSlide && child.active)
		},
		'$parent.nextSlide' () {
			this.nextChild = this.$children.some(child => child._isSlide && child.next)
		}
	},
	created () {
		this._isSlide = true
	},
	mounted () {
		const unorderedFragments = this.$children.filter(c => c._isFragment || c._isSlide)
		const unorderedFragmentsEls = unorderedFragments.map(c => c.$el)
		const orderByDOM = (children) => {
			if (!children) return
			for (const child of children) {
				const index = unorderedFragmentsEls.indexOf(child)
				if (index >= 0) {
					if (unorderedFragments[index]._isSlide) {
						this.nestedSlides.push(unorderedFragments[index])
						continue
					}
					this.fragments.push(unorderedFragments[index])
				}
				orderByDOM(child.children)
			}
		}
		orderByDOM(this.$el.children)
		this.computeScale()
		if (window !== undefined) {
			window.addEventListener('resize', this.computeScale)
		}
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
		}
	}
}
</script>
<style lang="stylus">
.daumenkino-slide
	position: absolute
	width: 100vw
	height: 100vh
	top: 0
	left: 0
	display: flex
	flex-direction: column
	justify-content: center
	align-items: center
	&:not(.nested) > .daumenkino-slide-content
			display: flex
			flex-direction: column
			justify-content: center
			align-items: center
			width: 960px
			height: 700px
			transform: scale(var(--scale)) translateZ(0)
	.daumenkino-fragment:not(.daumenkino-fragment-show)
		visibility: hidden
.daumenkino.speaker-mode:not(.overview) .daumenkino-slide:not(.nested)
	border: 2px solid #CCC
	top: 24px
	height: 60vh
	width: 40vw
	&.active
		left: 24px
		.daumenkino-fragment:not(.daumenkino-fragment-show)
			visibility: visible !important // HACK
			opacity: .5
	&.next
		left: unset
		right: 24px
		.daumenkino-fragment
			visibility: visible !important // HACK

.daumenkino.overview
	.daumenkino-slide
		position: relative
		&.nested
			display: flex
			flex-direction: column
			justify-content: flex-start
		&:not(.nested)
			border: 2px solid #CCC
			width: calc(var(--scale) * 0.3 * 960px)
			height: calc(var(--scale) * 0.3 * 700px)
			margin: 16px
			& > .daumenkino-slide-content
				transform: scale(calc(var(--scale) * 0.3)) translateZ(0)
		&.active
			border: 2px solid #333
	> .daumenkino-slide
		transform: translate(calc(var(--active-slide-x) * var(--scale) * 0.3 * -992px + var(--scale) * 0.3 * 0.5 * -992px), calc(var(--active-slide-y) * var(--scale) * 0.3 * -732px + var(--scale) * 0.3 * 0.5 * -732px))
	.daumenkino-fragment
		visibility: visible !important // HACK

.daumenkino:not(.speaker-mode):not(.overview)
	.slide-next-enter-active, .slide-next-leave-active, .slide-previous-enter-active, .slide-previous-leave-active
		transition: transform .5s ease

	.slide-next-enter, .slide-previous-leave-to
		transform: translateX(100vw)
	.slide-next-leave-to, .slide-previous-enter
		transform: translateX(-100vw)
</style>
