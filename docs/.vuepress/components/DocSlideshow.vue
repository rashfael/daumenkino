<template lang="pug">
daumenkino
	slide
		h1 daumenkino
		h2 Yet Another Presentation Framework
	slide
		h1 Hello World
	slide
		h1 Fragments
		ul
			fragment: li This is a fragment
			fragment: li This is another fragment
			fragment: li And another one
	slide
		slide
			h1 Slide Overview
			:markdown
				press `ESC` to view all slides at once!
		slide
			h1 Nested Slides
	slide
		slide
			h1 Speaker Mode
			:markdown
				press `s` to open speaker window
		slide
			h1 Speaker Nodes
			:markdown use a `notes` element to write yourself notes for the speaker mode
			notes: :markdown
				- hi
				- We are notes!
				- horray!
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
