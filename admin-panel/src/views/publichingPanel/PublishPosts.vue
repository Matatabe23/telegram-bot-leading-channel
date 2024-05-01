<template>
  <div class="posts">

    <div class="posts__post" v-for="post in posts" :key="post.id">
      <div class="posts__postContent">
        <div class="posts__postImages">
          <img class="posts__postImage" v-for="img in post.imageData" :key="img.id" :src="img.image" alt="">
        </div>
        <div class="posts__postDetails">
          <h2 class="posts__postTitle">id: {{ post.id }}</h2>
          <p class="posts__postDescription">{{ post.description }}</p>
          <div class="posts__controle-buttons">
            <button class="posts__editButton">Редактировать</button>
            <button class="posts__deleteButton" @click=deletePost(post.id)>Удалить</button>
            <button class="posts__openButton">Открыть</button>
            <button class="posts__pushButton">Опубликовать</button>
          </div>
        </div>
      </div>
    </div>


    <div class="posts__pagination" v-if="posts.length">
      <button @click="setPage(1)" :disabled="currentPage === 1">
        <<</button>
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
import { IPublishPosts, post } from '@/types';
import {deletePost} from '@/http/postsAPI'

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
      type: Array as () => post[],
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
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
      await deletePost(id);
      this.getPosts();
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

  &__editButton,
  &__deleteButton,
  &__openButton,
  &__pushButton {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  &__editButton:hover,
  &__deleteButton:hover,
  &__openButton:hover,
  &__pushButton:hover {
    background-color: #0056b3;
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