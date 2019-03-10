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
		this.$nextTick(() => {
		})
	},
	methods: {
		afterLeave () {
			this.$emit('after-leave')
		}
	}
}
</script>
<style lang="stylus">
</style>
