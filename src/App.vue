<template>
  <v-app>
    <v-app-bar app color="primary">

    <v-layout align-start justify-start>
      <h4 class="white--text px-2">Theme Change</h4>
      <v-switch class="white--text" :label="$vuetify.theme.dark ? ('Dark') : ('Light')" v-model="$vuetify.theme.dark"></v-switch>
    </v-layout>
    </v-app-bar>

    <v-content>
      <Dashboard/>
    </v-content>
  </v-app>
</template>

<script>
import Dashboard from './views/Dashboard';

export default {
  name: 'App',
  data(){
    return{
      Dswitch:this.$vuetify.theme.dark
    }
  },
  components: {
    Dashboard,
  }
};
</script>
