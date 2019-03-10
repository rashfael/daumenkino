import Daumenkino from './daumenkino'
import Slide from './slide'

const lib = {
	install (Vue) {
		Vue.component(`daumenkino`, Daumenkino)
		Vue.component(`slide`, Slide)
	}
}

export default lib
