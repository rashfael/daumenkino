<template lang="pug">
transition(name="slide-next", @after-leave="afterLeave")
	.daumenkino-slide(v-show="active")
		slot
</template>
<script>
export default {
	components: {},
	data () {
		return {
			fragments: [],
			shownFragments: 0
		}
	},
	computed: {
		active () {
			return !this.$parent.animating && this.$parent.activeSlide === this
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
	},
	methods: {
		afterLeave () {
			this.$emit('after-leave')
		},
		showNextFragment () {
			this.shownFragments++
		},
		showPreviousFragment () {
			this.shownFragments--
		}
	}
}
</script>
<style lang="stylus">
.daumenkino-slide

	.daumenkino-fragment:not(.daumenkino-fragment-show)
		visibility: hidden
</style>
