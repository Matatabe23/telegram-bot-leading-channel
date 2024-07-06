<template>
  <div class="posts">
    <div class="posts__header">
      <div class="posts__info">
        <div v-if="totalCount">Всего постов: {{ totalCount }}</div>
        <div v-if="lastPublishDate">Крайняя дата публикации: {{ lastPublishDate }}</div>
      </div>
      <div class="posts__download">
        <select @change="updateWatched" v-model="form.watched" class="posts__select-watched">
          <option value="">Нечего</option>
          <option value="watched">Просмотренные</option>
          <option value="unwatched">Не просмотренные</option>
        </select>
        <MainButton class="posts__deleteButton" @click="downloadSqlDataBases">Скачать базу данных SQL</MainButton>
      </div>
    </div>


    <div class="posts__post" v-for="post in postsList" :key="post.id">
      <div class="posts__postContent">
        <div class="posts__postImages">
          <img class="posts__postImage" v-for="img in post.imageData" :key="img.id" :src="img.image" alt="">
        </div>
        <div class="posts__postDetails">
          <h2 class="posts__postTitle">id: {{ post.id }}</h2>
          <div class="posts__controle-buttons">
            <MainButton class="posts__deleteButton" @click=delPost(post.id)>Удалить</MainButton>
            <MainButton class="posts__openButton" @click="router.push(`post/${post.id}`)">Открыть</MainButton>
            <MainButton class="posts__pushButton" @click=publishInstantlyPost(post.id)>Опубликовать</MainButton>
          </div>
        </div>
      </div>
    </div>


    <div class="posts__pagination" v-if="postsList.length">
      <button @click="setPage(1)" :disabled="form.currentPage === 1">
        << </button>
          <button v-for="pageNumber in visiblePages" :key="pageNumber" @click="setPage(pageNumber)"
            :class="{ 'active': pageNumber === form.currentPage }">{{ pageNumber }}</button>
          <button @click="setPage(lastPage)" :disabled="form.currentPage === lastPage">>></button>
          <select @change="updatePostsPerPage" v-model="form.postsPerPage">
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, reactive } from 'vue';
import { deletePost, publishInstantly } from '@/http/postsAPI'
import { useToast } from 'vue-toastification';
import { usePosts } from '@/store/usePosts';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { watch } from 'fs';


const toast = useToast()
const editorStore = usePosts();
const router = useRouter()
const { postsList, totalCount, publishTime, form } = storeToRefs(editorStore);


const setPage = (page: number) => {
  editorStore.setStateValueByKey('form', { ...form.value, currentPage: page });
  editorStore.getPosts();
}

const updatePostsPerPage = async (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  editorStore.setStateValueByKey('form', { ...form.value, postsPerPage: parseInt(value, 10), currentPage: 1 });
  editorStore.getPosts();
}

const delPost = async (id: number) => {
  try {
    if (!confirm('Вы уверены, что хотите удалить пост?')) {
      return;
    }
    editorStore.setStateValueByKey('isLoader', true);
    const result = await deletePost(id);
    toast.success(result)
    editorStore.getPosts();
  } catch (e) {

  } finally {
    editorStore.setStateValueByKey('isLoader', false);
  }
}

const publishInstantlyPost = async (id: number) => {
  try {
    if (!confirm('Вы уверены, что хотите опубликовать пост?')) {
      return;
    }
    editorStore.setStateValueByKey('isLoader', true);
    const result = await publishInstantly(id);
    toast.success(result);
    editorStore.getPosts();
  } catch (e: any) {
    toast.error(e.response.data);
  } finally {
    editorStore.setStateValueByKey('isLoader', false);
  }
}

const downloadSqlDataBases = () => {
  toast.error('Кнопка пока не работает')
}

const lastPage = computed(() => {
  return Math.ceil(totalCount.value / form.value.postsPerPage);
})

const visiblePages = computed(() => {
  const maxVisiblePages = 10; // Максимальное количество отображаемых страниц
  const totalPages = Math.ceil(totalCount.value / form.value.postsPerPage);;
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxVisiblePages) {
    const half = Math.floor(maxVisiblePages / 2);
    startPage = Math.max(form.value.currentPage - half, 1);
    endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - maxVisiblePages + 1;
    }
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
})


const lastPublishDate = computed(() => {
  if (!publishTime.value.length) return '';

  const postsPerDay = publishTime.value.length;
  const totalDays = Math.ceil(totalCount.value / postsPerDay);

  const startDate = new Date();
  const lastPostDate = new Date(startDate);
  lastPostDate.setDate(startDate.getDate() + totalDays);

  return lastPostDate.toLocaleDateString();
})

const updateWatched = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;

  localStorage.setItem('watched', JSON.stringify(value))
  editorStore.setStateValueByKey('form', { ...form.value, watched: value});
  editorStore.getPosts();
}

onMounted(() => {
  const watched = JSON.parse(localStorage.getItem('watched') || '');
  editorStore.setStateValueByKey('form', { ...form.value, watched});
  editorStore.getPosts();
})
</script>

<style lang="scss">
.posts {
  width: 95%;
  position: relative;
  min-width: 500px;
  min-height: 500px;


  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__info {
    margin-bottom: 10px;
  }

  &__download {
    margin-left: auto;
  }

  &__post {
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__postContent {
    display: flex;
    padding: 20px;
  }

  &__postImages {
    margin-right: 20px;
  }

  &__postImage {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 10px;
  }

  &__postDetails {
    flex: 1;
  }

  &__postTitle {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
  }

  &__postDescription {
    font-size: 16px;
    color: #666;
    margin-bottom: 15px;
  }

  &__controle-buttons {
    display: flex;
    gap: 10px;
  }

  &__loaderPosts {
    position: absolute;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }

  &__pagination button {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    color: #333;
    padding: 8px 12px;
    margin: 0 2px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
    border-radius: 4px;
  }

  &__pagination button:hover {
    background-color: #ddd;
    color: #555;
    border-color: #aaa;
  }

  &__pagination button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &__pagination button.active {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
  }

  &__pagination select {
    margin-left: 10px;
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }

  &__select-watched{
    margin-right: 20px;
  }
}
</style>