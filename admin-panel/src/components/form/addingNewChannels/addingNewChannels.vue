<template>
  <div class="adding-new-channels">
    <div class="adding-new-channels__save-time">
      <h3>Добавить новый канал</h3>

      <div class="adding-new-channels__form">
        <v-text-field clearable label="Имя канала" variant="outlined" v-model="state.form.name"></v-text-field>
        <v-text-field clearable label="айди чата" variant="outlined" v-model="state.form.chatId"></v-text-field>
      </div>

      <MainButton @click="saveChannel">Сохранить</MainButton>
      <h3 v-if="props.listChannels.length">Список чатов</h3>
      <div class="adding-new-channels__list-channels" v-for="channel in props.listChannels" :key="channel.id">
        <div>
          Имя чата: {{ channel.name }}
        </div>
        <div>
          Айди чата: {{ channel.chatId }}
        </div>
        <VSwitch hide-details label="Приватность чата"
          @change="updateDefaultChannel(channel, IEditChannelType.PRIVATED)"
          :model-value="channel.settings.includes(IEditChannelType.PRIVATED)">
        </VSwitch>

        <VSwitch hide-details label="Канал дефолтный"
          @change="updateDefaultChannel(channel, IEditChannelType.DEFAULT_CHANNEL)"
          :model-value="channel.settings.includes(IEditChannelType.DEFAULT_CHANNEL)">
        </VSwitch>

        <MainButton @click="delChannel(channel.id)">Удалить</MainButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { addingNewChannels, deleteChannel, editChannel } from '@/http/settingsAPI'
import { IStateChannels, IEditChannelType, IGetListChannels } from '@/types'
import { useToast } from 'vue-toastification';

const toast = useToast()

const props = defineProps<{
  listChannels: IGetListChannels[];
}>();

const emit = defineEmits<{
  'get-list': [],
}>();

const state: IStateChannels = reactive({
  form: {
    name: '',
    chatId: '',
    listChannels: []
  }
})

const getList = async () => {
  emit('get-list')
}

const saveChannel = async () => {
  try {
    if (state.form.name === '' || state.form.chatId === '') {
      toast.error('Заполните поля')
      return
    }

    const result = await addingNewChannels(state.form.name, state.form.chatId);

    if (result) {
      await getList();
      toast.success('Успешное добавление!')
      state.form.name = ''
      state.form.chatId = ''
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

const updateDefaultChannel = async (channel: IGetListChannels, type: IEditChannelType) => {
  try {
    const settings = channel.settings.length > 0 ? [...channel.settings.split(',')] : [];

    if (settings.includes(type)) {
      const index = settings.indexOf(type);
      if (index > -1) {
        settings.splice(index, 1);
      }
    } else if (!settings.includes(type)) {
      settings.push(type)
    }

    await editChannel(channel.id, settings);
    await getList();
  } catch (e) {
    console.error(e);
  }
}




watch(() => props.listChannels, (value) => {
  state.form.listChannels = value
  console.log(state.form.listChannels.find(channel => channel.id === 3)?.settings)
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
    margin-top: 15px;
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
