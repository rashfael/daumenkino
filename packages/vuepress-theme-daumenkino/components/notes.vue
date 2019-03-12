<template lang="pug">
portal(to="notes")
	.daumenkino-notes(v-if="show")
		slot
</template>
<script>
export default {
	name: 'notes',
	computed: {
		show () {
			return this.$parent.active
		}
	}
}
</script>
