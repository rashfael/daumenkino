import cloneDeep from 'lodash/cloneDeep'

export default {
	components: {},
	data () {
		return {
		}
	},
	computed: {
		show () {
			return this.$parent.shownFragments > this.$parent.fragments.indexOf(this)
		}
	},
	created () {
		this._isFragment = true
	},
	mounted () {
		this.$nextTick(() => {
		})
	},
	methods: {},
	render (createElement) {
		const slot = this.$slots.default[0]
		let data = cloneDeep(slot.data) || {}
		if (!data.staticClass) {
			data.staticClass = []
		}
		data.staticClass.push('daumenkino-fragment')
		if (this.show) {
			data.staticClass.push('daumenkino-fragment-show')
		}
		return createElement(slot.tag, data, slot.children || slot.text)
	}
}
