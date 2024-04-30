<template>
  <div class="posts">

    <div class="posts__post" v-for="post in posts" :key="post.id">
      <div class="posts__postImage" v-for="img in post.imageData" :key="img.id">
        <img :src="img.image" alt="">
      </div>
      <div class="posts__controle-button">
        <button>Редактировать</button>
        <button>Удалить</button>
        <button>Открыть</button>
      </div>
    </div>


    <div class="posts__pagination">
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


    <Loader v-if="loaderPosts" class="posts__loaderPosts" />

    <popup-message ref="popup"></popup-message>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { receiving } from '@/http/postsAPI';
import { IPublishPosts } from '@/types';

export default defineComponent({
  data(): IPublishPosts {
    return {
      posts: [],
      loaderPosts: false,
      currentPage: 1,
      postsPerPage: 3,
      totalCount: 0
    };
  },
  methods: {
    async getPosts() {
      try {
        this.loaderPosts = true
        const posts = await receiving(this.currentPage, this.postsPerPage)
        this.posts = posts.posts;
        this.totalCount = posts.totalCount
      } catch (e: any) {

      } finally {
        this.loaderPosts = false
      }
    },
    setPage(page: number) {
      this.currentPage = page;
      this.getPosts();
    },
    updatePostsPerPage(value: any){
      this.postsPerPage = value.target.value
      this.getPosts();
    }
  },
  computed: {
    lastPage() {
      return Math.ceil(this.totalCount / this.postsPerPage);
    },
    visiblePages() {
      const maxVisiblePages = 10; // Максимальное количество отображаемых страниц
      const totalPages = this.lastPage;
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
  },
  mounted() {
    this.getPosts()
  }
})
</script>

<style lang="scss">
.posts {
  width: 95%;
  position: relative;
  min-width: 500px;
  min-height: 500px;

  &__post {
    border: 3px solid gray;
    border-radius: 5px;
    background-color: azure;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
  }

  &__controle-button {
    display: flex;
    justify-content: space-evenly;
  }

  &__postImage img {
    height: 100px;
    margin: 10px;
    flex-wrap: wrap;
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