import cloneDeep from 'lodash/cloneDeep'

export default {
	name: 'fragment',
	computed: {
		show () {
			return this.$parent.shownFragments > this.$parent.fragments.indexOf(this)
		}
	},
	created () {
		this._isFragment = true
	},
	render (createElement) {
		const slot = this.$slots.default[0]
		const data = cloneDeep(slot.data) || {}
		if (!data.class) {
			data.class = []
		}
		if (data.staticClass) {
			data.class.push(...data.staticClass.split(' '))
			data.staticClass = null
		}
		data.class.push('daumenkino-fragment')
		if (this.show) {
			data.class.push('daumenkino-fragment-show')
		}
		return createElement(slot.tag, data, slot.children || slot.text)
	}
}
