<template>
  <div class="adding-publication-time-settings">
    <div class="adding-publication-time-settings__save-time">
      <h3>Настройка времени публикации</h3>
      <div class="adding-publication-time-settings__type">
        <label for="timeType">Канал:</label>
        <select id="timeType" v-model="state.timeType">
          <option value="constant">Постоянное</option>
          <option value="regular">Регулярное</option>
        </select>
      </div>

      <div class="adding-publication-time-settings__time">
        <label for="hourInput">Часы:</label>
        <select id="hourInput" v-model="state.hour">
          <option v-for="h in 24" :key="h" :value="h">{{ h }}</option>
        </select>
        <label for="minuteInput">Минуты:</label>
        <select id="minuteInput" v-model="state.minute">
          <option v-for="m in 60" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>

      <MainButton @click="saveTime">Сохранить</MainButton>
      <h3 v-if="state.listPublicationTimes.length">Время регулярной публикации</h3>
      <div class="adding-publication-time-settings__list-time" v-for="listPublicationTime in state.listPublicationTimes"
        :key="listPublicationTime.id">
        <div>
          Часы: {{ listPublicationTime.hour }}
        </div>
        <div>
          Минуты: {{ listPublicationTime.minute }}
        </div>
        <MainButton @click="deleteTime(listPublicationTime.id)">Удалить</MainButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, reactive } from 'vue';
import { addingPublicationTime, getListRegularPublicationTimes, deleteItemPublicationTimes } from '@/http/settingsAPI'
import { IAddingPublicationTimeSettings } from '@/types'
import { useToast } from 'vue-toastification';

const toast = useToast()

const state: IAddingPublicationTimeSettings = reactive({
  timeType: 'constant', // добавляем новое свойство для выбора типа времени
  hour: '0',
  minute: '0',
  listPublicationTimes: []
})

const getList = async () => {
  state.listPublicationTimes = await getListRegularPublicationTimes()
}

const saveTime = async () => {
  try {
    if (state.hour === '' || state.minute === '') {
      toast.error('Заполните поля')
      return
    }

    const result = await addingPublicationTime(state.hour, state.minute);

    if (result) {
      await getList();
      toast.success('Успешное добавление!')
      state.hour = '0'
      state.minute = '0'
    }
  } catch (e: any) {
    toast.error(e.response.data)
  }
}

const deleteTime = async (id: number) => {
  const result = await deleteItemPublicationTimes(id);
  toast.success(result);
  await getList();
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss">
.adding-publication-time-settings {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  margin: 20px;

  &__save-time {
    background-color: #2f2f2f;
    color: #ffffff;
    border: 1px solid #444;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    width: 350px;
  }

  &__type,
  &__time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;

    select {
      padding: 10px;
      margin: 0 5px;
      border-radius: 5px;
      border: 1px solid #555;
      background-color: #3b3b3b;
      color: #fff;
    }
  }

  &__list-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    border: 1px solid #444;
    border-radius: 5px;
    padding: 10px;
    background-color: #333;
    color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }

  button {
    margin: 10px 0;
  }
}
</style>
