import Vuex from 'vuex'
import PortalVue from 'portal-vue'
import Slide from '@theme/components/slide'
import Fragment from '@theme/components/fragment'
import Notes from '@theme/components/notes'

import store from '@theme/store'

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
