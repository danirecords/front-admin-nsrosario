<template>
  <main class="login-page">
    <section class="login-card" aria-labelledby="login-title">
      <div class="brand-mark" aria-hidden="true">
        <v-icon icon="mdi-church" size="30" />
      </div>
      <p class="eyebrow">Paróquia de Nossa Senhora do Rosário</p>
      <h1 id="login-title">Bem-vindo</h1>
      <p class="intro">Entre com suas credenciais para continuar.</p>

      <v-form @submit.prevent="submitLogin">
        <v-text-field
          v-model="email"
          label="E-mail"
          placeholder="Digite seu e-mail"
          prepend-inner-icon="mdi-email-outline"
          autocomplete="email"
          type="email"
          variant="outlined"
          color="indigo-darken-3"
          :disabled="loading"
          required
        />
        <v-text-field
          v-model="password"
          label="Senha"
          placeholder="Digite sua senha"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          variant="outlined"
          color="indigo-darken-3"
          :disabled="loading"
          required
          @click:append-inner="showPassword = !showPassword"
        />
        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" density="comfortable">
          {{ errorMessage }}
        </v-alert>
        <v-btn
          type="submit"
          color="indigo-darken-4"
          size="large"
          block
          rounded="lg"
          :loading="loading"
          :disabled="!email || !password"
        >
          Entrar
          <v-icon icon="mdi-arrow-right" end />
        </v-btn>
      </v-form>
      <p class="footer-note">Acesso restrito à equipe da paróquia</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

async function submitLogin() {
  loading.value = true
  errorMessage.value = ''

  try {
    const endpoint = import.meta.env.VITE_AUTH_TOKEN_PATH || '/auth/login'
    const response = await api.post(endpoint, {
      email: email.value,
      password: password.value
    })
    const token = response.data?.access_token ?? response.data?.token

    if (typeof token !== 'string' || !token) {
      throw new Error('A resposta da API não contém um token válido.')
    }

    localStorage.setItem('beaver_token', token)
    await router.replace({ name: 'home' })
  } catch (error: any) {
    const status = error?.response?.status
    errorMessage.value = status === 401 || status === 403
      ? 'Usuário ou senha inválidos.'
      : 'Não foi possível entrar. Verifique a conexão e tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 40px 20px;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(48, 63, 159, 0.12), transparent 48%),
    #f5f6fa;
}

.login-card {
  width: min(100%, 440px);
  padding: 40px;
  border: 1px solid rgba(26, 35, 126, 0.08);
  border-radius: 20px;
  background: white;
  box-shadow: 0 18px 55px rgba(22, 31, 86, 0.1);
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  margin-bottom: 24px;
  border-radius: 16px;
  color: #1a237e;
  background: #eef0ff;
}

.eyebrow {
  margin-bottom: 8px;
  color: #4b5682;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

h1 {
  color: #171c3b;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.intro {
  margin: 10px 0 28px;
  color: #70758a;
}

.footer-note {
  margin: 24px 0 0;
  color: #85899a;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 480px) {
  .login-card { padding: 30px 24px; }
}
</style>
