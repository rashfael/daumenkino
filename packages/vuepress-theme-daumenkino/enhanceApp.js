import Vuex from 'vuex'
import PortalVue from 'portal-vue'
import Slide from './components/slide'
import Fragment from './components/fragment'
import Notes from './components/notes'

import store from './store'

export default ({
	Vue, // the version of Vue being used in the VuePress app
	options, // the options for the root Vue instance
	router, // the router instance for the app
	siteData // site metadata
}) => {
	Vue.use(Vuex)
	options.store = store()
	Vue.use(PortalVue)

	Vue.component(`slide`, Slide)
	Vue.component(`fragment`, Fragment)
	Vue.component(`notes`, Notes)
}
