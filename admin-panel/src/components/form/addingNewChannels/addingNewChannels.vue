<template>
  <div class="adding-new-channels">
    <div class="adding-new-channels__save-time">
      <h3>Добавить новый канал</h3>

      <div class="adding-new-channels__form">
        <div class="adding-new-channels__form__block">
          <label for="hourInput">Имя канала:</label>
          <input type="text" v-model="state.name">
        </div>
        <div class="adding-new-channels__form__block">
          <label for="minuteInput">айди чата:</label>
          <input type="text" v-model="state.chatId">
        </div>
      </div>

      <MainButton @click="saveChannel">Сохранить</MainButton>
      <h3 v-if="state.listChannels.length">Список чатов</h3>
      <div class="adding-new-channels__list-channels" v-for="channel in state.listChannels" :key="channel.id">
        <div>
          Имя чата: {{ channel.name }}
        </div>
        <div>
          Айди чата: {{ channel.chatId }}
        </div>
        <div>
          Приватность чата:
          <select v-model="channel.privated" @change="updateDefaultChannel(channel.id, $event, IEditChannelType.PRIVATED)">
            <option :value="true">Да</option>
            <option :value="false">Нет</option>
          </select>
        </div>
        <div>
          Канал дефолтный:
          <select v-model="channel.defaultChannels" @change="updateDefaultChannel(channel.id, $event, IEditChannelType.DEFAULT_CHANNEL)">
            <option :value="true">Да</option>
            <option :value="false">Нет</option>
          </select>
        </div>
        <MainButton @click="delChannel(channel.id)">Удалить</MainButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { addingNewChannels, getListChannel, deleteChannel, editChannel } from '@/http/settingsAPI'
import { IStateChannels, IEditChannelType } from '@/types'
import { useToast } from 'vue-toastification';

const toast = useToast()

const state: IStateChannels = reactive({
  name: '',
  chatId: '',
  listChannels: []
})

const getList = async () => {
  state.listChannels = await getListChannel()
}

const saveChannel = async () => {
  try {
    if (state.name === '' || state.chatId === '') {
      toast.error('Заполните поля')
      return
    }

    const result = await addingNewChannels(state.name, state.chatId);

    if (result) {
      await getList();
      toast.success('Успешное добавление!')
      state.name = ''
      state.chatId = ''
    }
  } catch (e: any) {
    toast.error(e.response.data)
  }
}

const delChannel = async (id: number) => {
  const result = await deleteChannel(id);
  toast.success(result);
  await getList();
}

const updateDefaultChannel = async (channelId: number, event: Event, type: IEditChannelType) => {
  try{
    const isDefault = event.target.value
    await editChannel(channelId, isDefault, type)
    await getList();
  } catch(e){
    //
  }
}

  onMounted(() => {
    getList()
  })
</script>

<style lang="scss">
.adding-new-channels {
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

  &__form {

    &__block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;
    }

    input {
      padding: 10px;
      margin: 0 5px;
      border-radius: 5px;
      border: 1px solid #555;
      background-color: #3b3b3b;
      color: #fff;
    }
  }

  &__list-channels {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
