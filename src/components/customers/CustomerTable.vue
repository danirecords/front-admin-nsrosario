<template>
  <v-card
    rounded="xl"
    elevation="3"
  >
    <!-- BUSCA -->
    <v-card-title class="pa-4">

      <v-text-field
        v-model="search"
        density="compact"
        label="Buscar cliente"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
      />

    </v-card-title>

    <!-- TABELA -->
    <v-data-table
      :headers="headers"
      :items="customers"
      :loading="loading"
      :search="search"
      item-value="id"
    >

      <!-- STATUS VAZIO -->
      <template v-slot:no-data>

        <v-alert
          type="info"
          variant="tonal"
          class="ma-4"
        >
          Nenhum cliente encontrado
        </v-alert>

      </template>

      <!-- AÇÕES -->
      <template v-slot:item.actions="{ item }">

        <div class="d-flex ga-2">

          <!-- EDITAR -->
          <v-btn
            icon
            color="warning"
            variant="tonal"
            size="small"
            @click="emit('edit', item)"
          >
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>

          <!-- EXCLUIR -->
          <v-btn
            icon
            color="error"
            variant="tonal"
            size="small"
            @click="emit('delete', item)"
          >
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>

        </div>

      </template>

    </v-data-table>

  </v-card>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  customers: {
    type: Array,
    default: () => []
  },

  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'edit',
  'delete'
])

const search = ref('')

const headers = [
  {
    title: 'Nome',
    key: 'name'
  },

  {
    title: 'Email',
    key: 'email'
  },

  {
    title: 'Telefone',
    key: 'phone'
  },

  {
    title: 'Documento',
    key: 'document'
  },

  {
    title: 'Ações',
    key: 'actions',
    sortable: false
  }
]
</script>