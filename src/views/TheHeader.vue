<template>
  <v-app-bar
    color="indigo-darken-4"
    elevation="4"
  >
    <v-app-bar-title>
      Paróquia de Nossa Senhora do Rosário
    </v-app-bar-title>

    <v-spacer />

    <v-btn to="/" variant="text">
      Home
    </v-btn>

    <v-btn to="/message-daddy" variant="text">
      Mensagem Papa
    </v-btn>

    <v-btn to="/albums" variant="text">
      Fotos
    </v-btn>

    <v-btn variant="text" prepend-icon="mdi-logout" @click="logout">
      Sair
    </v-btn>

  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('beaver_token')
  router.replace({ name: 'login' })
}
</script>
