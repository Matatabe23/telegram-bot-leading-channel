<template>
  <div class="post-panel">
    <div class="post-panel__buttons">
      <v-btn variant="flat" @click="backPage" color="#5865f2">Предыдущий пост</v-btn>
      <v-btn variant="flat" @click="delPost" color="#5865f2">Удалить пост</v-btn>
      <v-btn variant="flat" @click="deleteSelectedImg" color="#5865f2">Удалить выбранные изображения</v-btn>
      <div class="post-panel__select-channel">
        <v-select label="Каналы публикации" :items="channelsListSelect" multiple variant="outlined"
          v-model="state.form.useChannelList" @update:model-value="updateChannelList"></v-select>
      </div>
      <v-btn variant="flat" @click="nextPage" color="#5865f2">Следующий пост</v-btn>
    </div>

    <div class="post-panel__img-list">
      <div v-for="(photo, index) in state.images" :key="index" class="post-panel__img-item">
        <img :src="photo.img" alt="Photo" class="post-panel__image" @load="checkImageLoaded">
        <MainCheckBox height="20px" class="post-panel__delete-check-box" v-if="state.imagesToLoad < 1"
          :model-value="state.checkListImage.some(checkId => checkId.id === photo.id)"
          @update:model-value="setValueSheckBox(photo)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue';
import { receivingPost, deletePost, changePage } from '@/http/postsAPI';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { usePosts } from '@/store/usePosts';
import { deleteSelectedImgs, editPostLinkСhannels } from '@/http/postsAPI'
import { useSettings } from '@/store/useSettings';
import { storeToRefs } from 'pinia';

const route = useRoute()
const router = useRouter()
const toast = useToast()
const editorStore = usePosts();
const settingsStore = useSettings();
const { listChannels } = storeToRefs(settingsStore);

const state = reactive({
  images: [],
  checkListImage: [],
  imagesToLoad: 0,

  form: {
    useChannelList: []
  }
})


const openPostPanel = async () => {
  try {
    editorStore.setStateValueByKey('isLoader', false);
    state.form.useChannelList = []
    state.images = []

    const response = await receivingPost(Number(route.params.id));
    state.images = response.imageList;
    state.form.useChannelList = response.channelsPost?.map(item => item.id)
  } catch (e) {
    router.push('/publishing-panel');
    localStorage.setItem('watched', (''))
    toast.error(e.response.data.message)
  } finally {
    state.imagesToLoad = state.images.length;
    if (state.imagesToLoad === 0) {
      editorStore.setStateValueByKey('isLoader', false);
    }
  }
}

const switchPostPanel = async (who: string) => {
  try {
    editorStore.setStateValueByKey('isLoader', true);
    state.form.useChannelList = []
    state.images = []
    const watched = localStorage.getItem('watched') || ''
    const channel = localStorage.getItem('channel') || ''

    const response = await changePage(Number(route.params.id), who, watched, channel)
    state.images = response.imageList;
    state.form.useChannelList = response.channelsPost?.map(item => item.id)
    router.push(response.postId.toString())
  } catch (e) {
    router.push('/publishing-panel');
    localStorage.setItem('watched', (''))
    toast.error(e.response.data.message)
  } finally {
    state.imagesToLoad = state.images.length;
    if (state.imagesToLoad === 0) {
      editorStore.setStateValueByKey('isLoader', false);
    }
  }
}

const checkImageLoaded = () => {
  state.imagesToLoad--;
  if (state.imagesToLoad === 0) {
    editorStore.setStateValueByKey('isLoader', false);
  }
};

const delPost = async () => {
  try {
    if (!confirm('Вы уверены, что хотите удалить пост?')) {
      return;
    }
    editorStore.setStateValueByKey('isLoader', true);
    const result = await deletePost(Number(route.params.id));
    nextPage()
    toast.success(result)
  } catch (e) {
    toast.error(e.response.data.message)
  } finally {
    editorStore.setStateValueByKey('isLoader', false);
  }
}

const backPage = async () => {
  switchPostPanel('back')
}

const nextPage = async () => {
  switchPostPanel('next')
}

const setValueSheckBox = async (value: any) => {
  const event = state.checkListImage.some(checkId => checkId.id === value.id);
  if (!event) {
    state.checkListImage.push(value)
  } else {
    state.checkListImage = state.checkListImage.filter(item => item.id !== value.id)
  }
}

const deleteSelectedImg = async () => {
  try {
    if (state.checkListImage.length >= 1) {
      editorStore.setStateValueByKey('isLoader', true);
      await deleteSelectedImgs(state.checkListImage);
      openPostPanel();
    } else {
      toast.error(e.response.data.message)
    }
  } catch (e) {
    toast.error('Ошибка')
  } finally {
    editorStore.setStateValueByKey('isLoader', false);
  }
}

const channelsListSelect = computed(() => {
  if (!listChannels.value) return
  const channelsArray = listChannels.value.map(channel => ({
    title: channel.name,
    value: channel.id
  }));

  return channelsArray
});

const updateChannelList = async () => {
  try {
    await editPostLinkСhannels(Number(route.params.id), state.form.useChannelList)
  } catch (e) {
    toast.error(e.response.data.message)
  }
}

onMounted(() => {
  openPostPanel()
})
</script>

<style lang="scss">
.post-panel {
  width: 100%;

  &__buttons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 80px auto 0 auto;
    border: 3px solid grey;
    background-color: rgb(81, 86, 86);
    border-radius: 15px;
    width: 90%;
    padding: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__img-list {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
    margin: 50px 0;
  }

  &__select-channel {
    min-width: 30%;
    color: #fff;

    .v-input__details {
      min-height: 0;
      padding: 0;
      height: 0;
    }
  }

  &__img-item {
    position: relative;
  }

  &__image {
    height: 58vh;
    width: 45vh;
    object-fit: contain;
    border-radius: 15px;
  }

  &__delete-check-box {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
</style>