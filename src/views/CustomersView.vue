<template>

  <v-container fluid class="pa-6">

    <!-- TOPO -->
    <div class="d-flex justify-space-between align-center mb-6">

      <div>
        <h1 class="text-h4 font-weight-bold">
          Clientes
        </h1>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        rounded="lg"
      >
        Incluir Cliente
      </v-btn>

    </div>

    <!-- TABELA -->
    <CustomerTable
      :customers="customers"
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />

  </v-container>

</template>

<script setup>
import { ref, onMounted } from 'vue'

import CustomerTable from '/src/components/customers/CustomerTable.vue'

import api from '/src/services/api'

const customers = ref([])
const loading = ref(false)

const getCustomers = async () => {

  try {

    loading.value = true

    const response = await api.get('/customers')

    customers.value = response.data

  } catch (error) {

    console.error('Erro ao buscar clientes', error)

  } finally {

    loading.value = false

  }
}

const handleEdit = (customer) => {

  console.log('Editar:', customer)

}

const handleDelete = (customer) => {

  console.log('Excluir:', customer)

}

onMounted(() => {

  getCustomers()

})
</script>