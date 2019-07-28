<template lang="pug">
portal(to="notes", v-if="show")
	.daumenkino-notes
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
