<template>

  <v-container fluid class="pa-6">

    <!-- TOPO -->
    <div class="d-flex justify-space-between align-center mb-6">

      <div>
        <h1 class="text-h4 font-weight-bold">
          Fotos
        </h1>
      </div>

      <v-btn
        color="primary"
        @click="openCreate"
        prepend-icon="mdi-plus"
        size="large"
        rounded="lg"
      >
        Incluir nova foto
      </v-btn>

    </div>

    <!-- TABELA -->
    <PhotosTable
      :photos="photos"
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <PhotosForm
      :model-value="dialog"
      :photo="selectedPhoto"
      @saved="handleSaved"
      @save-error="handleSaveError"
      @photo-deleted="handlePhotoDeleted"
      @photo-delete-error="handlePhotoDeleteError"
      @update:model-value="handleDialogUpdate"
    />

    <PhotosDeleteDialog
      :model-value="deleteDialog"
      :photo="selectedPhotoToDelete"
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

import PhotosTable from '/src/components/photos/PhotosTable.vue'
import PhotosForm from '/src/components/photos/PhotosForm.vue'
import PhotosDeleteDialog from '/src/components/photos/PhotosDeleteDialog.vue'

import api from '/src/services/api'

const photos = ref([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const deleting = ref(false)
const selectedPhoto = ref(null)
const selectedPhotoToDelete = ref(null)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const getPhotos = async () => {

  try {

    loading.value = true

    const response = await api.get('/api/v1/albums')

    photos.value = response.data

  } catch (error) {

    console.error('Erro ao buscar fotos', error)

  } finally {

    loading.value = false

  }
}

const loadMessages = async () => {
  const { data } = await api.get('/api/v1/albums')

  photos.value = data
}

const handleSaved = async ({ action }) => {
  await loadMessages()

  const photo = action === 'updated'
    ? 'Foto atualizada com sucesso.'
    : 'Foto incluída com sucesso.'

  showFeedback(photo)
}

const handleSaveError = ({ action }) => {
  const photo = action === 'updated'
    ? 'Não foi possível atualizar a mensagem.'
    : 'Não foi possível incluir a mensagem.'

  showFeedback(photo, 'error')
}

const handlePhotoDeleted = async () => {
  await loadMessages()
  showFeedback('Foto adicional excluída com sucesso.')
}

const handlePhotoDeleteError = () => {
  showFeedback('Não foi possível excluir a foto adicional.', 'error')
}

const handleEdit = (photos) => {
  selectedPhoto.value = { ...photos }
  dialog.value = true

}

const handleDelete = (photos) => {
  selectedPhotoToDelete.value = { ...photos }
  deleteDialog.value = true

}

const openCreate = () => {
  selectedPhoto.value = null
  dialog.value = true
}

const handleDialogUpdate = (value) => {
  dialog.value = value

  if (!value) {
    selectedPhoto.value = null
  }
}

const handleDeleteDialogUpdate = (value) => {
  deleteDialog.value = value

  if (!value) {
    selectedPhotoToDelete.value = null
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
  if (!selectedPhotoToDelete.value?.id) {
    return
  }

  try {
    deleting.value = true

    await api.delete(`/api/v1/albums/${selectedPhotoToDelete.value.id}`)

    await loadMessages()
    showFeedback('Foto excluída com sucesso.')
    handleDeleteDialogUpdate(false)
  } catch (error) {
    console.error(error)
    showFeedback('Não foi possível excluir a foto.', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {

  getPhotos()

})
</script>
