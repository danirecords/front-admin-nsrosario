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
          v-model="form.title"
          label="Título"
          :error="titleError"
          :error-messages="titleError ? ['Título é obrigatório'] : []"
        />

        <v-text-field
          v-model="form.date"
          label="Data"
          type="date"
          :error="dateError"
          :error-messages="dateError ? ['Data é obrigatória'] : []"
        />

        <v-textarea
          v-model="form.content"
          label="Descrição"
          rows="4"
          auto-grow
          :error="contentError"
          :error-messages="contentError ? ['Descrição é obrigatória'] : []"
        />

        <v-file-input
          v-model="form.image"
          label="Imagem principal"
          accept="image/*"
          prepend-icon="mdi-image"
          show-size
          hint="Selecione a imagem principal do álbum"
          persistent-hint
          :error="imageError"
          :error-messages="imageError ? ['Imagem principal é obrigatória'] : []"
        />

        <div v-if="isEditing && props.photo?.image" class="text-caption mb-4">
          Imagem atual: {{ props.photo.image }}. Se não selecionar outra, ela será mantida.
        </div>

        <v-card
          v-if="isEditing && props.photo?.image"
          variant="outlined"
          class="mb-4"
        >
          <v-card-subtitle class="pt-3">Imagem principal atual</v-card-subtitle>
          <v-img
            :src="getMainImageUrl(props.photo.image)"
            :alt="`Imagem principal de ${form.title}`"
            max-height="260"
            contain
            class="ma-3"
          >
            <template #error>
              <div class="d-flex align-center justify-center fill-height text-medium-emphasis">
                Não foi possível carregar a imagem.
              </div>
            </template>
          </v-img>
        </v-card>

        <v-text-field
          v-model="form.link"
          label="Link"
          :error="linkError"
          :error-messages="linkError ? ['Link é obrigatório'] : []"
        />

        <v-file-input
          v-model="form.photos"
          label="Fotos adicionais"
          accept="image/*"
          multiple
          prepend-icon="mdi-image-multiple"
          show-size
          counter
          hint="Selecione uma ou mais fotos adicionais"
          persistent-hint
        />

        <div v-if="isEditing && existingPhotos.length" class="text-caption">
          {{ existingPhotos.length }} foto(s) adicional(is) já cadastrada(s). As novas seleções serão adicionadas.
        </div>

        <v-row v-if="isEditing && existingPhotos.length" class="mt-1">
          <v-col
            v-for="(photo, index) in existingPhotos"
            :key="`${photo}-${index}`"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card variant="outlined" class="position-relative">
              <v-btn
                v-if="photo.id"
                icon="mdi-delete"
                color="error"
                size="small"
                variant="elevated"
                class="position-absolute top-0 right-0 ma-2"
                :loading="deletingPhotoId === photo.id"
                :disabled="Boolean(deletingPhotoId)"
                aria-label="Excluir foto adicional"
                @click="deleteAdditionalPhoto(photo)"
              />
              <v-img
                :src="getAdditionalImageUrl(photo)"
                :alt="`Foto adicional ${index + 1} de ${form.title}`"
                height="160"
                cover
              >
                <template #error>
                  <div class="d-flex align-center justify-center fill-height text-medium-emphasis pa-4 text-center">
                    Não foi possível carregar a imagem.
                  </div>
                </template>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
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
import api from '../../services/api'

const titleError = ref(false)
const dateError = ref(false)
const contentError = ref(false)
const imageError = ref(false)
const linkError = ref(false)
const saving = ref(false)
const deletingPhotoId = ref(null)
const removedPhotoIds = ref([])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  
  photo: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'saved',
  'save-error',
  'photo-deleted',
  'photo-delete-error',
  'update:modelValue'
])

const form = ref({
  title: '',
  date: '',
  content: '',
  image: null,
  link: '',
  photos: []
})

const isEditing = computed(() => !!props.photo?.id)

const formTitle = computed(() => isEditing.value ? 'Editar Fotos' : 'Nova Foto')

const resetForm = () => {
  form.value = {
    title: '',
    date: '',
    content: '',
    image: null,
    link: '',
    photos: []
  }

  titleError.value = false
  dateError.value = false
  contentError.value = false
  imageError.value = false
  linkError.value = false
  removedPhotoIds.value = []
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
  () => [props.modelValue, props.photo],
  ([isOpen, photo]) => {
    if (!isOpen) {
      return
    }

    if (!photo) {
      resetForm()
      return
    }

    form.value = {
      title: photo.title || '',
      date: formatDateToInput(photo.date),
      content: photo.content || '',
      image: null,
      link: photo.link || '',
      photos: []
    }

    titleError.value = false
    dateError.value = false
    contentError.value = false
    imageError.value = false
    linkError.value = false
    removedPhotoIds.value = []
  },
  { immediate: true }
)

const closeModal = () => {
  emit('update:modelValue', false)
}

const existingPhotos = computed(() => {
  if (!Array.isArray(props.photo?.photos)) {
    return []
  }

  return props.photo.photos.filter((photo) => !removedPhotoIds.value.includes(photo.id))
})

const getMediaUrl = (directory, image) => {
  const imageName = typeof image === 'object' ? image.image : image

  if (!imageName) return ''

  if (/^https?:\/\//i.test(imageName)) {
    return imageName
  }

  const baseUrl = api.defaults.baseURL?.replace(/\/$/, '') || ''
  const imagePath = imageName.replace(/^\//, '')

  if (imagePath.startsWith('media/')) {
    return `${baseUrl}/${imagePath}`
  }

  return `${baseUrl}${directory}${imagePath}`
}

const getMainImageUrl = (image) => getMediaUrl('/media/galeria/album/', image)

const getAdditionalImageUrl = (photo) => getMediaUrl('/media/galeria/big/', photo)

const deleteAdditionalPhoto = async (photo) => {
  if (!photo?.id || !props.photo?.id) {
    return
  }

  if (!window.confirm('Deseja excluir esta foto adicional?')) {
    return
  }

  try {
    deletingPhotoId.value = photo.id

    await api.delete(`/api/v1/albums/${props.photo.id}/photos/${photo.id}`)

    removedPhotoIds.value = [...removedPhotoIds.value, photo.id]
    emit('photo-deleted')
  } catch (error) {
    console.error(error)
    emit('photo-delete-error')
  } finally {
    deletingPhotoId.value = null
  }
}

const save = async () => {

  titleError.value = !form.value.title.trim()
  dateError.value = !form.value.date
  contentError.value = !form.value.content.trim()
  imageError.value = !isEditing.value && !form.value.image
  linkError.value = !form.value.link.trim()

  if (titleError.value || dateError.value || contentError.value || imageError.value || linkError.value) {
    return
  }

  const payload = new FormData()
  payload.append('title', form.value.title.trim())
  payload.append('date', form.value.date)
  payload.append('content', form.value.content.trim())
  payload.append('link', form.value.link.trim())

  if (form.value.image) {
    payload.append('image', form.value.image)
  }

  form.value.photos.forEach((photo) => {
    payload.append('photos', photo)
  })

  try {
    saving.value = true
    const action = isEditing.value ? 'updated' : 'created'

    if (isEditing.value) {
      await api.put(`/api/v1/albums/${props.photo.id}`, payload)
    } else {
      await api.post('/api/v1/albums', payload)
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
