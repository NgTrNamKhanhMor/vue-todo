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
  VChip,
  VCol,
  VContainer,
  VDatePicker,
  VDialog,
  VDivider,
  VForm,
  VIcon,
  VList,
  VListItem,
  VListItemSubtitle,
  VListItemTitle,
  VMain,
  VPagination,
  VProgressCircular,
  VProgressLinear,
  VRow,
  VSkeletonLoader,
  VSpacer,
  VTab,
  VTabs,
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
    VChip,
    VDivider,
    VTabs,
    VTab,
    VProgressLinear,
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
          primary: '#42c7ef', // Define primary color
          secondary: '#424242', // Define secondary color
          accent: '#ade3f4',
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
