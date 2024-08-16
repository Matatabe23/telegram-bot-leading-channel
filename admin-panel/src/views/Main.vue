<template>
  <div class="main">

    <div class="main__authorization">
      <h1>Авторизация</h1>
      <v-text-field clearable label="Логин" variant="outlined" v-model="state.auth.name"></v-text-field>
      <v-text-field type='password' clearable label="Пароль" variant="outlined" v-model="state.auth.password"></v-text-field>
      <v-btn variant="tonal" :loading="isLoader" @click="setlogin">
        Авторизоваться
      </v-btn>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { IMainPages } from '@/types'
import { login } from '@/http/adminAPI'
import { useToast } from 'vue-toastification';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'vue-router';
import { usePosts } from '@/store/usePosts';
import { storeToRefs } from 'pinia';

const toast = useToast()
const editorStore = useAuth();
const router = useRouter()
const postsStore = usePosts();
const { isLoader } = storeToRefs(postsStore);

const state: IMainPages = reactive({
  auth: {
    name: "",
    password: ""
  },
})

const setlogin = async () => {
  try {
    postsStore.setStateValueByKey('isLoader', true);
    const response: any = await login(state.auth.name, state.auth.password);

    editorStore.setAdminData(response)

    router.push('/publishing-panel');
  } catch (e: any) {
    console.log(e)
    toast.error(e.response.data.message)
  } finally {
    postsStore.setStateValueByKey('isLoader', false);
  }
}
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
    width: 400px;
  }

  input {
    width: 280px;
  }

  &__main-button {
    width: 290px;
    margin-bottom: 10px;
  }
}
</style>
