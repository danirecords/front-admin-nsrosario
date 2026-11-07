<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-toolbar color="error">
        <v-toolbar-title>Excluir Mensagem</v-toolbar-title>

        <v-spacer />

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeModal"
        />
      </v-toolbar>

      <v-card-text class="mt-4">
        <p class="text-body-1 mb-3">
          Deseja realmente excluir esta mensagem?
        </p>

        <v-alert
          v-if="message"
          type="warning"
          variant="tonal"
        >
          <strong>ID {{ message.id }}</strong>
          <span v-if="message.date"> - {{ formatDate(message.date) }}</span>
          <div class="mt-2">
            {{ getExcerpt(message.content) }}
          </div>
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="outlined"
          :disabled="loading"
          @click="closeModal"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="error"
          variant="elevated"
          :loading="loading"
          @click="emit('confirm')"
        >
          Excluir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },

  message: {
    type: Object,
    default: null
  },

  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'confirm',
  'update:modelValue'
])

const closeModal = () => {
  emit('update:modelValue', false)
}

const getExcerpt = (html) => {
  if (!html) return ''

  const div = document.createElement('div')
  div.innerHTML = html

  const text = div.textContent?.trim() || ''

  return text.length > 140
    ? `${text.substring(0, 140)}...`
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
