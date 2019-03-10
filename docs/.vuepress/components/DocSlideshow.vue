<template lang="pug">
daumenkino
	slide
		h1 daumenkino
	slide
		h1 Hello World
	slide
		h1 Fragments
		ul
			fragment: li This is a fragment
			fragment: li This is another fragment
			fragment: li And another one
</template>
<script>
export default {
	components: {},
	data () {
		return {
		}
	},
	computed: {},
	created () {},
	mounted () {
		this.$nextTick(() => {
		})
	},
	methods: {}
}
</script>
<style lang="stylus">
</style>
