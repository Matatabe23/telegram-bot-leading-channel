<template>
  <div class="Authorization">
    <div v-if="islogin" class="Authorization__auth">
      <h2>Авторизация</h2>
      <input v-model="auth.email" type="text" placeholder="Email" @keydown.enter="loginOnEnter">
      <input v-model="auth.password" type="password" placeholder="Пароль" @keydown.enter="loginOnEnter">
      <button id="login" class="enter" @click="login">Войти</button>
      <button class="reg" @click="islogin = !islogin">Регистрация</button>
    </div>

    <div v-if="!islogin" class="Authorization__auth">
      <h2>Регистрация</h2>
      <input v-model="RegUser.email" type="text" placeholder="Email" @keydown.enter="registerOnEnter">
      <input v-model="RegUser.name" type="text" placeholder="Логин" @keydown.enter="registerOnEnter">
      <input v-model="RegUser.password" type="password" placeholder="Пароль" @keydown.enter="registerOnEnter">
      <input v-model="confirmPassword" type="password" placeholder="Повторение пароля" @keydown.enter="registerOnEnter">
      <button id="registration" class="enter" @click="Registration">Зарегистрироваться</button>
      <button class="reg" @click="islogin = !islogin">Авторизация</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Authorization',
  data() {
    return {
      islogin: true,
      auth: {
        email: "",
        password: ""
      },
      RegUser: {
        email: "",
        name: "",
        password: "",
      },
      confirmPassword: "",
    }
  },
  methods: {

  },
};
</script>

<style lang="scss">
body {
  overflow: hidden;
}

.Authorization {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  &__auth {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 200px;
    height: 200px;

    input {
      padding: 10px;
      width: 100%;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }

    button {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #053f7c;
    }
  }
}
</style>