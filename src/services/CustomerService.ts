import api from './api'

export const getAll = () => {
  return api.get('/customers')
}

export const create = (payload) => {
  return api.post('/customers', payload)
}

export const update = (id, payload) => {
  return api.put(`/customers/${id}`, payload)
}

export const remove = (id) => {
  return api.delete(`/customers/${id}`)
}