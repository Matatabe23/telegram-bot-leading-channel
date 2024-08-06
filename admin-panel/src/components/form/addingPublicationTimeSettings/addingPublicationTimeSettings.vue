<template>
  <div class="adding-publication-time-settings">
    <div class="adding-publication-time-settings__save-time">
      <h3>Настройка времени публикации</h3>
      <v-select class="adding-publication-time-settings__select" :items="formattedChannels" 
        label="Выберите канал" @update:model-value="selectChanel" variant="outlined"></v-select>

      <div class="adding-publication-time-settings__time">
        <v-select
        id="hourInput"
        v-model="state.hour"
        :items="hoursSelectValue"
        label="Часы"
        variant="outlined"
      ></v-select>
      <v-select
        id="minuteInput"
        v-model="state.minute"
        :items="minutesSelectValue"
        label="Минуты"
        variant="outlined"
      ></v-select>
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
import { computed, reactive } from 'vue';
import { addingPublicationTime, getListRegularPublicationTimes, deleteItemPublicationTimes } from '@/http/settingsAPI'
import { IAddingPublicationTimeSettings, IGetListChannels } from '@/types'
import { useToast } from 'vue-toastification';
import { VSelect } from 'vuetify/components';
import { storeToRefs } from 'pinia';
import { useSettings } from '@/store/useSettings';

const settingsStore = useSettings();
const { listChannels } = storeToRefs(settingsStore);

const toast = useToast()

const state: IAddingPublicationTimeSettings = reactive({
  timeType: 'constant',
  hour: '0',
  minute: '0',
  channelId: 0,
  listPublicationTimes: [],
})

const getList = async () => {
  state.listPublicationTimes = await getListRegularPublicationTimes(state.channelId)
}

const saveTime = async () => {
  try {
    if (state.hour === '' || state.minute === '') {
      toast.error('Заполните поля')
      return
    }

    const result = await addingPublicationTime(state.hour, state.minute, state.channelId);

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

const formattedChannels = computed(() => {
  return listChannels.value.map(channel => (channel.name));
})

const selectChanel = (name: string | null) => {
  const channel = listChannels.value.find(channel => channel.name === name);
  state.channelId = Number(channel?.id)
  getList()
};

const hoursSelectValue = computed(() => Array.from({ length: 25 }, (_, i) => i.toString()));
const minutesSelectValue = computed(() => Array.from({ length: 61 }, (_, i) => i.toString()));

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

  &__select {
    margin-top: 10px;
    .v-field__input {
     // min-height: 20px;
    }
  }

  &__time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    gap: 10px;

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
