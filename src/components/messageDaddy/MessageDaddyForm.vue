<template>
  <v-dialog
    :model-value="modelValue"
    max-width="900"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>

      <v-toolbar color="primary">
        <v-toolbar-title>{{ formTitle }}</v-toolbar-title>

        <v-spacer />

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeModal"
        />
      </v-toolbar>

      <v-card-text class="mt-4">

        <v-text-field
          v-model="form.date"
          label="Data"
          type="date"
          :error="dateError"
          :error-messages="dateError ? ['Data é obrigatória'] : []"
        />

        <ckeditor
          :editor="editor"
          v-model="form.content"
        />

        <div
          v-if="contentError"
          class="text-error mt-2"
        >
          A descrição é obrigatória.
        </div>
        
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="outlined"
          @click="closeModal"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="primary"
          variant="elevated"
          :loading="saving"
          @click="save"
        >
          Salvar
        </v-btn>

      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import api from '../../services/api'

const dateError = ref(false)
const contentError = ref(false)
const saving = ref(false)

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  
  message: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'saved',
  'save-error',
  'update:modelValue'
])

const editor = ClassicEditor

const form = ref({
  content: '',
  date: ''
})

const isEditing = computed(() => !!props.message?.id)

const formTitle = computed(() => isEditing.value ? 'Editar Mensagem' : 'Nova Mensagem')

const resetForm = () => {
  form.value = {
    content: '',
    date: ''
  }

  dateError.value = false
  contentError.value = false
}

const formatDateToInput = (date) => {
  if (!date) return ''

  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.toISOString().slice(0, 10)
}

watch(
  () => [props.modelValue, props.message],
  ([isOpen, message]) => {
    if (!isOpen) {
      return
    }

    if (!message) {
      resetForm()
      return
    }

    form.value = {
      content: message.content || '',
      date: formatDateToInput(message.date)
    }

    dateError.value = false
    contentError.value = false
  },
  { immediate: true }
)

const closeModal = () => {
  emit('update:modelValue', false)
}

const save = async () => {

  dateError.value = !form.value.date

  const text = form.value.content
    ?.replace(/<[^>]*>/g, '')
    ?.trim()

  contentError.value = !text

  if (dateError.value || contentError.value) {
    return
  }

  const payload = {
    content: form.value.content,
    date: form.value.date
  }

  try {
    saving.value = true
    const action = isEditing.value ? 'updated' : 'created'

    if (isEditing.value) {
      await api.put(`/api/v1/message-daddy/${props.message.id}`, payload)
    } else {
      await api.post('/api/v1/message-daddy', payload)
    }

    resetForm()

    emit('saved', { action })
    closeModal()

  } catch (error) {
    console.error(error)
    emit('save-error', {
      action: isEditing.value ? 'updated' : 'created'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style>
  .ck-editor__editable_inline {
    height: 350px;
  }
  .text-error {
    color: rgb(var(--v-theme-error));
    font-size: 12px;
  }
</style>
