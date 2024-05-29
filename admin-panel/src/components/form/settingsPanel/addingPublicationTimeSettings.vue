<template>
  <div class="adding-publication-time-settings">
    <div class="adding-publication-time-settings__save-time">
      <h3>Указать время постоянной публикации</h3>
      <div class="adding-publication-time-settings__hour">
        <label for="hourInput">Часы:</label>
        <input id="hourInput" v-model="hour" type="string" min="0" max="24" placeholder="От 0 до 24">
      </div>
      <div class="adding-publication-time-settings__minute">
        <label for="minuteInput">Минуты:</label>
        <input id="minuteInput" v-model="minute" type="string" min="0" max="59" placeholder="От 0 до 59">
      </div>
      <MainButton @click="saveTime">Сохранить</MainButton>
      <h3 v-if="listPublicationTimes.length">Время регулярной публикации</h3>
      <div class="adding-publication-time-settings__list-time" v-for="listPublicationTime in listPublicationTimes">
        <div>
          Часы:
          {{ listPublicationTime.hour }}
        </div>
        <div>
          Минуты:
          {{ listPublicationTime.minute }}
        </div>
        <MainButton @click="deleteTime(listPublicationTime.id)">Удалить</MainButton>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { addingPublicationTime, getListRegularPublicationTimes, deleteItemPublicationTimes } from '@/http/settingsAPI'
import { IAddingPublicationTimeSettings } from '@/types'
import { useToast } from 'vue-toastification';


const toast = useToast()

export default defineComponent({
  data(): IAddingPublicationTimeSettings {
    return {
      hour: '',
      minute: '',
      listPublicationTimes: []
    }
  },
  methods: {
    async saveTime() {
      try {
        if (this.hour === '' || this.minute === '') {
          toast.error('Заполните поля')
          return
        }

        const result = await addingPublicationTime(this.hour, this.minute);

        if (result) {
          this.getList();
          toast.success('Успешное добавление!')
          this.hour = ''
          this.minute = ''
        }
      } catch (e: any) {
        toast.error(e.response.data)
      }
    },
    async getList() {
      this.listPublicationTimes = await getListRegularPublicationTimes()
    },
    async deleteTime(id: number) {
      await deleteItemPublicationTimes(id);
      await this.getList();
    }
  },
  mounted() {
    this.getList()
  }
})
</script>

<style lang="scss">
.adding-publication-time-settings {
  display: flex;
  text-align: center;

  &__save-time {
    background-color: rgb(100, 100, 100);
    color: #fff;
    margin: 50px auto;
    border: 3px solid gray;
    padding: 20px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    border-bottom: 3px solid gray;
    width: 450px;
  }

  &__list-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    border: 3px solid gray;
    border-radius: 5px;
    padding: 10px;
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
