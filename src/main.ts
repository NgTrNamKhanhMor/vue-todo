import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import Vueform from '@vueform/vueform'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import vueformConfig from '@/vueform.config'
import {
  VAlert,
  VApp,
  VAppBar,
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VCheckbox,
  VCol,
  VContainer,
  VDatePicker,
  VDialog,
  VForm,
  VIcon,
  VList,
  VListItem,
  VListItemSubtitle,
  VListItemTitle,
  VMain,
  VPagination,
  VProgressCircular,
  VRow,
  VSkeletonLoader,
  VSpacer,
  VTextField,
  VToolbarTitle,
} from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
  components: {
    VSkeletonLoader,
    VIcon,
    VRow,
    VCol,
    VCheckbox,
    VCardTitle,
    VCard,
    VCardText,
    VToolbarTitle,
    VCardActions,
    VDialog,
    VSpacer,
    VBtn,
    VAppBar,
    VMain,
    VApp,
    VForm,
    VContainer,
    VTextField,
    VDatePicker,
    VList,
    VListItem,
    VListItemTitle,
    VListItemSubtitle,
    VAlert,
    VProgressCircular,
    VPagination,
  },
  directives,
  theme: {
    defaultTheme: 'light', // Set default theme to 'light' or 'dark'
    themes: {
      light: {
        colors: {
          primary: '#1976D2', // Define primary color
          secondary: '#424242', // Define secondary color
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
      dark: {
        colors: {
          primary: '#BB86FC',
          secondary: '#03DAC6',
          accent: '#03DAC6',
          error: '#CF6679',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

const app = createApp(App)
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(Vueform, vueformConfig)

app.mount('#app')
