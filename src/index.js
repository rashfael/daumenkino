import Daumenkino from './daumenkino'
import Slide from './slide'
import Fragment from './fragment'
import Notes from './notes'
import './base.styl'
import PortalVue from 'portal-vue'

const lib = {
	install (Vue) {
		Vue.use(PortalVue)
		Vue.component(`daumenkino`, Daumenkino)
		Vue.component(`slide`, Slide)
		Vue.component(`fragment`, Fragment)
		Vue.component(`notes`, Notes)
	}
}

export default lib
