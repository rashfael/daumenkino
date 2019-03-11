<template lang="pug">
portal(to="notes")
	.daumenkino-notes(v-if="show")
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
		show () {
			return this.$parent.active
		}
	},
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
