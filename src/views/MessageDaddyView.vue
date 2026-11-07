<template>

  <v-container fluid class="pa-6">

    <!-- TOPO -->
    <div class="d-flex justify-space-between align-center mb-6">

      <div>
        <h1 class="text-h4 font-weight-bold">
          Mensagem Papa
        </h1>
      </div>

      <v-btn
        color="primary"
        @click="openCreate"
        prepend-icon="mdi-plus"
        size="large"
        rounded="lg"
      >
        Incluir nova mensagem
      </v-btn>

    </div>

    <!-- TABELA -->
    <MessageDaddyTable
      :messagesDaddy="messagesDaddy"
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <MessageDaddyForm
      :model-value="dialog"
      :message="selectedMessage"
      @saved="handleSaved"
      @save-error="handleSaveError"
      @update:model-value="handleDialogUpdate"
    />

    <MessageDaddyDeleteDialog
      :model-value="deleteDialog"
      :message="selectedMessageToDelete"
      :loading="deleting"
      @confirm="confirmDelete"
      @update:model-value="handleDeleteDialogUpdate"
    />

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>

  </v-container>

</template>

<script setup>
import { ref, onMounted } from 'vue'

import MessageDaddyTable from '/src/components/messageDaddy/MessageDaddyTable.vue'
import MessageDaddyForm from '/src/components/messageDaddy/MessageDaddyForm.vue'
import MessageDaddyDeleteDialog from '/src/components/messageDaddy/MessageDaddyDeleteDialog.vue'

import api from '/src/services/api'

const messagesDaddy = ref([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const deleting = ref(false)
const selectedMessage = ref(null)
const selectedMessageToDelete = ref(null)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const getMessagesDaddy = async () => {

  try {

    loading.value = true

    const response = await api.get('/api/v1/message-daddy')

    messagesDaddy.value = response.data

  } catch (error) {

    console.error('Erro ao buscar mensagem do papa', error)

  } finally {

    loading.value = false

  }
}

const loadMessages = async () => {
  const { data } = await api.get('/api/v1/message-daddy')

  messagesDaddy.value = data
}

const handleSaved = async ({ action }) => {
  await loadMessages()

  const message = action === 'updated'
    ? 'Mensagem atualizada com sucesso.'
    : 'Mensagem incluída com sucesso.'

  showFeedback(message)
}

const handleSaveError = ({ action }) => {
  const message = action === 'updated'
    ? 'Não foi possível atualizar a mensagem.'
    : 'Não foi possível incluir a mensagem.'

  showFeedback(message, 'error')
}

const handleEdit = (messageDaddy) => {
  selectedMessage.value = { ...messageDaddy }
  dialog.value = true

}

const handleDelete = (messageDaddy) => {
  selectedMessageToDelete.value = { ...messageDaddy }
  deleteDialog.value = true

}

const openCreate = () => {
  selectedMessage.value = null
  dialog.value = true
}

const handleDialogUpdate = (value) => {
  dialog.value = value

  if (!value) {
    selectedMessage.value = null
  }
}

const handleDeleteDialogUpdate = (value) => {
  deleteDialog.value = value

  if (!value) {
    selectedMessageToDelete.value = null
  }
}

const showFeedback = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

const confirmDelete = async () => {
  if (!selectedMessageToDelete.value?.id) {
    return
  }

  try {
    deleting.value = true

    await api.delete(`/api/v1/message-daddy/${selectedMessageToDelete.value.id}`)

    await loadMessages()
    showFeedback('Mensagem excluída com sucesso.')
    handleDeleteDialogUpdate(false)
  } catch (error) {
    console.error(error)
    showFeedback('Não foi possível excluir a mensagem.', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {

  getMessagesDaddy()

})
</script>
