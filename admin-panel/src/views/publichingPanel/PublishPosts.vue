<template>
  <div class="posts">
    <div class="posts__header"  v-if="totalCount">
      <div class="posts__info">
      <div>Всего постов: {{ totalCount }}</div>
      <div v-if="lastPublishDate">Крайняя дата публикации: {{ lastPublishDate }}</div>
    </div>
    <div class="posts__download">
      <MainButton class="posts__deleteButton" @click="downloadSqlDataBases">Скачать базу данных SQL</MainButton>
    </div>
    </div>


    <div class="posts__post" v-for="post in posts" :key="post.id">
      <div class="posts__postContent">
        <div class="posts__postImages">
          <img class="posts__postImage" v-for="img in post.imageData" :key="img.id" :src="img.image" alt="">
        </div>
        <div class="posts__postDetails">
          <h2 class="posts__postTitle">id: {{ post.id }}</h2>
          <p class="posts__postDescription">{{ post.description }}</p>
          <div class="posts__controle-buttons">
            <MainButton class="posts__deleteButton" @click=deletePost(post.id)>Удалить</MainButton>
            <MainButton class="posts__openButton" @click="$emit('post-panel', post.id)">Открыть</MainButton>
            <MainButton class="posts__pushButton" @click=publishInstantly(post.id)>Опубликовать</MainButton>
          </div>
        </div>
      </div>
    </div>


    <div class="posts__pagination" v-if="posts.length">
      <button @click="setPage(1)" :disabled="currentPage === 1"><<</button>
          <button v-for="pageNumber in visiblePages" :key="pageNumber" @click="setPage(pageNumber)"
            :class="{ 'active': pageNumber === currentPage }">{{ pageNumber }}</button>
          <button @click="setPage(lastPage)" :disabled="currentPage === lastPage">>></button>
          <select @change="updatePostsPerPage" v-model="postsPerPage">
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
    </div>


    <Loader v-if="loaderPosts" overlay="false" class="posts__loaderPosts" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IPublishPosts, IPostsList } from '@/types';
import { deletePost, publishInstantly } from '@/http/postsAPI'
import { useToast } from 'vue-toastification';


const toast = useToast()

export default defineComponent({
  data(): IPublishPosts {
    return {
      loaderPosts: false,
      currentPage: 1,
      postsPerPage: 3,
    };
  },
  props: {
    posts: {
      type: Array as () => IPostsList[],
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
    publishTime: {
      type: Array as () => { hour: string, minute: string }[],
      required: true
    }
  },
  methods: {
    async getPosts() {
      try {
        this.loaderPosts = true;
        this.$emit('get-posts', this.currentPage, this.postsPerPage)
      } catch (e: any) {
        console.error(e);
      } finally {
        setTimeout(() => {
          this.loaderPosts = false;
        }, 500);
      }
    },
    setPage(page: number) {
      this.currentPage = page;
      this.getPosts();
    },
    updatePostsPerPage(event: Event) {
      const value = (event.target as HTMLSelectElement).value;
      this.postsPerPage = parseInt(value, 10);
      this.currentPage = 1;
      this.getPosts();
    },
    async deletePost(id: number) {
      try {
        if (!confirm('Вы уверены, что хотите удалить пост?')) {
          return;
        }
        this.loaderPosts = true
        const result = await deletePost(id);
        toast.success(result)
        this.getPosts();
      } catch (e) {

      }
    },
    async publishInstantly(id: number) {
      try {
        if (!confirm('Вы уверены, что хотите опубликовать пост?')) {
          return;
        }
        this.loaderPosts = true
        const result = await publishInstantly(id);
        toast.success(result);
        this.getPosts();
      } catch (e: any) {
        toast.error(e.response.data);
      }

    },
    async downloadSqlDataBases(){
      toast.error('Кнопка пока не работает')
    }
  },
  computed: {
    lastPage(): number {
      return Math.ceil(this.totalCount / this.postsPerPage);
    },
    visiblePages() {
      const maxVisiblePages = 10; // Максимальное количество отображаемых страниц
      const totalPages = Math.ceil(this.totalCount / this.postsPerPage);;
      let startPage = 1;
      let endPage = totalPages;

      if (totalPages > maxVisiblePages) {
        const half = Math.floor(maxVisiblePages / 2);
        startPage = Math.max(this.currentPage - half, 1);
        endPage = startPage + maxVisiblePages - 1;

        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = endPage - maxVisiblePages + 1;
        }
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    },
    lastPublishDate(): string {
      if (!this.publishTime.length) return '';
      
      const postsPerDay = this.publishTime.length;
      const totalDays = Math.ceil(this.totalCount / postsPerDay);
      
      const startDate = new Date();
      const lastPostDate = new Date(startDate);
      lastPostDate.setDate(startDate.getDate() + totalDays);
      
      return lastPostDate.toLocaleDateString();
    }
  },
  mounted() {
    this.getPosts();
  }
})
</script>

<style lang="scss">
.posts {
  width: 95%;
  position: relative;
  min-width: 500px;
  min-height: 500px;


  &__header{
    display: flex;
    justify-content: space-between;
  }

  &__info{
    margin-bottom: 10px;
  }

  &__download{
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
}
</style>