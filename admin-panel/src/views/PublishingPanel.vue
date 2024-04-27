<template>
  <div class="publishing-panel">
    <div class="publishing-panel__publishes-form">
      <div>
        <label for="file-upload" class="publishing-panel__custom-file-upload">
          <i class="fas fa-upload"></i> Загрузить файлы
        </label>
        <input id="file-upload" type="file" multiple @change="handleFileUpload">
      </div>
      <MainButton @click="publication">Опубликовать</MainButton>
    </div>
    <div class="publishing-panel__image" v-if="images.length">
      <div v-for="(photo, index) in images" :key="index">
        <img :src="photo" alt="Photo" class="publishing-panel__image__form">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { publication } from '@/http/postsAPI';
import { IPublishingPanel } from '@/types';

export default defineComponent({
  data(): IPublishingPanel {
    return {
      images: [],
      imagePost: []
    };
  },
  methods: {
    async handleFileUpload(event: any) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            this.images.push(reader.result);
          }
        };
        this.imagePost.push(file)
        reader.readAsDataURL(file);
      }
    },
    async publication() {
      await publication(this.imagePost);
    }
  },
})
</script>

<style lang="scss">
.publishing-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200vh;
  height: 100vh;
  margin-top: 5vh;

  &__publishes-form {
    display: flex;
    justify-content: space-between;
    width: 330px;
    margin-bottom: 20px;
  }



  &__custom-file-upload {
    display: inline-block;
    cursor: pointer;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: 1px solid #007bff;
    border-radius: 5px;
    padding: 10px 20px;
  }

  &__custom-file-upload:hover {
    background-color: #0056b3;
  }

  &__custom-file-upload i {
    margin-right: 5px;
  }

  /* Скрыть стандартный элемент input[type="file"] */
  #file-upload {
    display: none;
  }

  
  &__image {
    background-color: rgb(81, 86, 86);
    border-radius: 15px;
    border: 3px solid grey;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 65vh;
    width: 150vh;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    overflow-y: auto;

    &__form {
      height: 40vh;
      width: 25vh;
      object-fit: contain;
    }
  }
}
</style>