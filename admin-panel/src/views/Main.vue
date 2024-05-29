<template>
  <div class="main">

    <div class="main__authorization">
      <h1>Авторизация</h1>
      <input type="text" v-model="auth.name" placeholder="Введите ваше имя пользователя" />
      <input type="password" v-model="auth.password" placeholder="Введите пароль" />
      <MainButton class="main__main-button" @click="login">Авторизоваться</MainButton>
    </div>

    <Loader v-if="loader" />

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IMainPages, adminData } from '@/types'
import { mapActions } from 'vuex';
import { login } from '@/http/adminAPI'
import { useToast } from 'vue-toastification';


const toast = useToast()

export default defineComponent({
  data(): IMainPages {
    return {
      loader: false,
      auth: {
        name: "",
        password: ""
      },
    }
  },
  methods: {
    ...mapActions({
      storeAdminData: 'storeAdminData'
    }),
    
    async login() {
      try {
        this.loader = true;

        const response = await login(this.auth.name, this.auth.password);

        this.storeAdminData(response);

        this.$router.push('/publishing-panel');
      } catch (e: any) {
        toast.error(e.response.data.message)
      } finally {
        this.loader = false;
      }

    }
  },
});
</script>

<style lang="scss">
.main {
  display: flex;
  width: 300vh;
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
