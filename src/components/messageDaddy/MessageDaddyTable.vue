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
        label="Buscar Mensagem"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
      />

    </v-card-title>

    <!-- TABELA -->
    <v-data-table
      :headers="headers"
      :items="messagesDaddy"
      :loading="loading"
      :search="search"
      item-value="id"
    >

      <template v-slot:item.content="{ item }">
         {{ getExcerpt(item.content) }}
      </template>

      <template v-slot:item.date="{ item }">
         {{ formatDate(item.date) }}
      </template>

      <!-- STATUS VAZIO -->
      <template v-slot:no-data>

        <v-alert
          type="info"
          variant="tonal"
          class="ma-4"
        >
          Nenhuma mensagem encontrado
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

const handleSaved = async () => {
  await loadMessages()
}

defineProps({
  messagesDaddy: {
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
    title: 'ID',
    key: 'id'
  },

  {
    title: 'Descrição',
    key: 'content'
  },

  {
    title: 'Data',
    key: 'date'
  },

  {
    title: 'Ações',
    key: 'actions',
    sortable: false
  }
]

const getExcerpt = (html) => {
  if (!html) return ''

  const div = document.createElement('div')
  div.innerHTML = html

  const firstParagraph = div.querySelector('p')

  const text = firstParagraph
    ? firstParagraph.textContent.trim()
    : ''

  return text.length > 100
    ? `${text.substring(0, 100)}...`
    : text
}

const formatDate = (date) => {
  if (!date) return ''

  if (typeof date === 'string') {
    const [year, month, day] = date.substring(0, 10).split('-')

    if (year && month && day) {
      return `${day}/${month}/${year}`
    }
  }

  return new Date(date).toLocaleDateString('pt-BR')
}
</script>
