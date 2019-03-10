import Daumenkino from './daumenkino'
import Slide from './slide'
import Fragment from './fragment'
import './base.styl'

const lib = {
	install (Vue) {
		Vue.component(`daumenkino`, Daumenkino)
		Vue.component(`slide`, Slide)
		Vue.component(`fragment`, Fragment)
	}
}

export default lib
