<template>
  <div class="posts">
    <div class="posts__header">
      <div class="posts__info">
        <div v-if="totalCount">Всего постов: {{ totalCount }}</div>
        <div v-if="lastPublishDate">Крайняя дата публикации: {{ lastPublishDate }}</div>
      </div>
      <mainSelect class="posts__select-watched" :options="watchedOptions" v-model="form.watched"
        @onChange="updateWatched" />
    </div>


    <div class="posts__post" v-for="post in postsList" :key="post.id">
      <postCard :post="post" @delete-post="delPost" @publish-instantly-post="publishInstantlyPost" />
    </div>


    <div class="posts__pagination" v-if="postsList.length">
      <button @click="setPage(1)" :disabled="form.currentPage === 1">
        << </button>
          <button v-for="pageNumber in visiblePages" :key="pageNumber" @click="setPage(pageNumber)"
            :class="{ 'active': pageNumber === form.currentPage }">{{ pageNumber }}</button>
          <button @click="setPage(lastPage)" :disabled="form.currentPage === lastPage">>></button>
          <mainSelect class="posts__select-watched" :options="perPage" v-model="form.postsPerPage"
          @onChange="updatePostsPerPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { deletePost, publishInstantly } from '@/http/postsAPI'
import { useToast } from 'vue-toastification';
import { usePosts } from '@/store/usePosts';
import { storeToRefs } from 'pinia';
import postCard from '@/components/form/postCard/postCard.vue'
import mainSelect from '@/components/UI/mainSelect/mainSelect.vue'
import { watchedOptions, perPage } from '@/const';
import { IOptionsFromSelect } from '@/components/UI/mainSelect/mainSelect.i'

const toast = useToast()
const editorStore = usePosts();
const { postsList, totalCount, publishTime, form } = storeToRefs(editorStore);


const setPage = (page: number) => {
  editorStore.setStateValueByKey('form', { ...form.value, currentPage: page });
  editorStore.getPosts();
}

const updatePostsPerPage = async (value: IOptionsFromSelect) => {
  editorStore.setStateValueByKey('form', { ...form.value, postsPerPage: parseInt(value.value, 10), currentPage: 1 });
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

const updateWatched = (value: IOptionsFromSelect) => {
  localStorage.setItem('watched', (value.value))
  editorStore.setStateValueByKey('form', { ...form.value, watched: value.value });
  editorStore.getPosts();
}

onMounted(() => {
  const watched = localStorage.getItem('watched') || "";
  editorStore.setStateValueByKey('form', { ...form.value, watched });
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
    margin-bottom: 10px;
  }

  &__info {
    margin-bottom: 10px;
  }

  &__download {
    margin-left: auto;
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

  &__select-watched {
    margin-right: 20px;
  }
}
</style>