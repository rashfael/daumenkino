import Daumenkino from './daumenkino'
import Slide from './slide'
import Fragment from './fragment'

const lib = {
	install (Vue) {
		Vue.component(`daumenkino`, Daumenkino)
		Vue.component(`slide`, Slide)
		Vue.component(`fragment`, Fragment)
	}
}

export default lib
