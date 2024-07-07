<template>
  <div class="post-panel">
    <div class="post-panel__buttons">
      <MainButton @click="backPage">Предыдущий пост</MainButton>
      <MainButton @click="delPost">Удалить пост</MainButton>
      <MainButton @click="deleteSelectedImg">Удалить выбранные изображения</MainButton>
      <MainButton @click="nextPage">Следующий пост</MainButton>
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
import { onMounted, reactive } from 'vue';
import { receivingPost, deletePost, changePage } from '@/http/postsAPI';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { usePosts } from '@/store/usePosts';
import { storeToRefs } from 'pinia';
import { deleteSelectedImgs } from '@/http/postsAPI'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const editorStore = usePosts();
const { postsList, totalCount, publishTime, form } = storeToRefs(editorStore);

const state = reactive({
  images: [],
  checkListImage: [],
  imagesToLoad: 0
})

const openPostPanel = async () => {
  const postId = Number(route.params.id);
  state.images = await receivingPost(postId);
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
    toast.success(result)
    editorStore.getPosts();
    nextPage()
  } catch (e) {

  } finally {
    editorStore.setStateValueByKey('isLoader', false);
  }
}

const backPage = async () => {
  try {
    state.images = []
    editorStore.setStateValueByKey('isLoader', true);

    const watched = JSON.parse(localStorage.getItem('watched') || '');
    const response = await changePage(Number(route.params.id), 'back', watched)
    router.push(response.postId.toString())

    state.images = response.imageList
  } catch (e) {
    router.push('/publishing-panel');
    toast.error('Пост не найден');
  } finally {
    state.imagesToLoad = state.images.length;
    if (state.imagesToLoad === 0) {
      editorStore.setStateValueByKey('isLoader', false);
    }
  }
}

const nextPage = async () => {
  try {
    state.images = []
    editorStore.setStateValueByKey('isLoader', true);

    const watched = JSON.parse(localStorage.getItem('watched') || '');
    const response = await changePage(Number(route.params.id), 'next', watched)
    router.push(response.postId.toString())

    state.images = response.imageList
  } catch (e) {
    router.push('/publishing-panel');
    toast.error('Пост не найден');
  } finally {
    state.imagesToLoad = state.images.length;
    if (state.imagesToLoad === 0) {
      editorStore.setStateValueByKey('isLoader', false);
    }
  }
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
      openPostPanel()
    } else {
      toast.error('Нету выбранных img')
    }
  } catch (e) {
    toast.error('Ошибка')
  } finally {
    editorStore.setStateValueByKey('isLoader', false);
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
    margin: 80px auto 0 auto;
    border: 3px solid grey;
    background-color: rgb(81, 86, 86);
    border-radius: 15px;
    width: 90%;
    padding: 20px;
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