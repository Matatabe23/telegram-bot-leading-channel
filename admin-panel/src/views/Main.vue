<template>
  <div class="main">

    <div v-if="!islogin" class="main__authorization">
      <h1>Авторизация</h1>
      <input type="text" v-model="auth.name" placeholder="Введите ваше имя пользователя" />
      <input type="password" v-model="auth.password" placeholder="Введите пароль" />
      <MainButton class="main__main-button" @click="login">Авторизоваться</MainButton>
      <MainButton class="main__main-button" @click="toggleRegistration">Регистрация</MainButton>
    </div>

    <div v-if="islogin" class="main__registration">
      <h1>Регистрация</h1>
      <input type="text" v-model="name" placeholder="Введите ваше имя пользователя">
      <input type="password" v-model="password" placeholder="Введите пароль" />
      <input type="password" v-model="confirmPassword" placeholder="Повторите пароль" />
      <MainButton class="main__main-button" @click="register">Зарегистрироваться</MainButton>
      <MainButton class="main__main-button" @click="toggleRegistration">Отмена</MainButton>
    </div>

    <Loader v-if="loader" />

    <popup-message ref="popup"></popup-message>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IMainPages, adminData } from '@/types'
import { useStore, mapActions } from 'vuex';
import { registration, login } from '@/http/adminAPI'

export default defineComponent({
  data(): IMainPages {
    return {
      islogin: false,
      loader: false,
      auth: {
        name: "",
        password: ""
      },
      name: "",
      password: "",
      confirmPassword: "",
    }
  },
  methods: {
    ...mapActions({
      storeadminData: 'storeadminData'
    }),

    toggleRegistration() {
      this.islogin = !this.islogin
    },
    async login() {
      try {
        this.loader = true;

        const response = await login(this.auth.name, this.auth.password);

        this.storeadminData(response);

        this.$router.push('/publishing-panel');
      } catch (e: any) {
        console.log(e)
        // (this.$refs.popup as { showMessage: (message: string, duration: number) => void }).showMessage(e.response.data.message, 10000);
      } finally {
        this.loader = false;
      }

    },
    async register() {
      try {
        this.loader = true;
        await registration(this.name, this.password, this.confirmPassword);
        (this.$refs.popup as { showMessage: (message: string, duration: number) => void }).showMessage('Успешная регистрация!', 10000);
        this.islogin = false
        this.name = ''
        this.password = '',
        this.confirmPassword = ''
      } catch (e: any) {
        (this.$refs.popup as { showMessage: (message: string, duration: number) => void }).showMessage(e.response.data.message, 10000);
      } finally {
        this.loader = false;
      }
    },
  },
});
</script>

<style lang="scss">
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  &__authorization,
  &__registration {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(230, 228, 224);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 300px;
    width: 350px;
  }

  input {
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 280px;
  }

  &__main-button {
    width: 290px;
    margin-bottom: 10px;
  }
}
</style>
