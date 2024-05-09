<template>
  <div class="adding-publication-time-settings">
    <div class="adding-publication-time-settings__save-time">
      <h3>Указать время постоянной публикации</h3>
      <div class="adding-publication-time-settings__hour">
        <label for="hourInput">Часы:</label>
        <input id="hourInput" v-model="hour" type="string" min="0" max="24">
      </div>
      <div class="adding-publication-time-settings__minute">
        <label for="minuteInput">Минуты:</label>
        <input id="minuteInput" v-model="minute" type="string" min="0" max="59">
      </div>
      <MainButton @click="saveTime">Сохранить</MainButton>
    </div>

    <popup-message ref="popup"></popup-message>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { addingPublicationTime } from '@/http/settingsAPI'

export default defineComponent({
  data() {
    return {
      hour: '',
      minute: '',
    }
  },
  methods: {
    async saveTime() {
      try {
        if (this.hour === '' || this.minute === '') {
          (this.$refs.popup as { showMessage: (message: string, duration: number) => void }).showMessage('Заполните поля', 5000);
          return
        }

        const result = await addingPublicationTime(this.hour, this.minute);

        if (result) {
          (this.$refs.popup as { showMessage: (message: string, duration: number) => void }).showMessage('Успешное добавление!', 5000);
          this.hour = ''
          this.minute = ''
        }
      } catch (e: any) {
        (this.$refs.popup as { showMessage: (message: string, duration: number) => void }).showMessage(e.response.data, 5000);
      }
    },
  },
})
</script>

<style lang="scss">
.adding-publication-time-settings {
  display: flex;

  &__save-time {
    background-color: rgb(100, 100, 100);
    color: #fff;
    margin: 50px auto;
    border: 3px solid gray;
    padding: 20px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
  }

  &__hour,
  &__minute {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 10%;

    input {
      padding: 10px;
    }
  }
}
</style>
