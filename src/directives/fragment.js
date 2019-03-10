class Scrollbars {
	constructor (el, options) {
		this.options = options

	}
}

export default function (Vue) {
	Vue.directive('fragment', {
		bind (el, binding, vnode) {

		},
		inserted (el, binding, vnode, oldVnode) {
			debugger
		},
		componentUpdated (el, binding, vnode, oldVnode) {
		debugger
		},
		unbind (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__scrollbar) return
			el.__buntpapier__scrollbar.destroy()
		}
	})
}

export { Scrollbars }
