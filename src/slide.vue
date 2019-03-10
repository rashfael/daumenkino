<template lang="pug">
transition(:name="`slide-${direction}`", @after-leave="afterLeave")
	.daumenkino-slide(v-show="active || activeChild || next", :class="{next}", :style="style")
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
			return this.$parent.nextSlide === this
		},
		style () {
			const speakerFactor = this.$parent.speakerMode ? (this.next ? 0.5 : 0.5) : 1
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
			return this.$parent.transitionDirection
		}
	},
	watch: {
		'$parent.activeSlide' () {
			this.activeChild = this.$children.some(child => child._isSlide && child.active)
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
		.daumenkin-fragement
			visibility: visible !important // HACK

.daumenkino:not(.speaker-mode)
	.slide-next-enter-active, .slide-next-leave-active, .slide-previous-enter-active, .slide-previous-leave-active
		transition: transform .5s ease

	.slide-next-enter, .slide-previous-leave-to
		transform: translateX(100vw)
	.slide-next-leave-to, .slide-previous-enter
		transform: translateX(-100vw)
</style>
