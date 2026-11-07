<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from './views/TheHeader.vue';
const route = useRoute()
const showHeader = computed(() => route.name !== 'login' && Boolean(localStorage.getItem('beaver_token')))

</script>

<template>
   <v-app>
      <TheHeader v-if="showHeader" />
       <v-main>
           <router-view />
      </v-main>
  </v-app>
</template>
