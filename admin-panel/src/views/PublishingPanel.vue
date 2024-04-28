<template>
  <div class="publishing-panel">
    <div class="publishing-panel__image">
      <div class="publishing-panel__image-form">
        <div v-for="(photo, index) in images" :key="index">
          <img :src="photo" alt="Photo" class="publishing-panel__form">
        </div>
      </div>

      <div class="publishing-panel__publishes-form">

        <div>
          <label for="file-upload" class="publishing-panel__custom-file-upload">
            <i class="fas fa-upload"></i> Загрузить файлы
          </label>
          <input id="file-upload" type="file" multiple @change="handleFileUpload">
        </div>
        <MainCheckBox label="Водяной знак" height="20px" v-model="waterMark" />
        <MainCheckBox label="Опубликовать сразу" height="20px" v-model="instantPublication" />

        <MainButton @click="publication">Опубликовать</MainButton>

      </div>
    </div>

    <Loader v-if="loader" />
    <popup-message ref="popup"></popup-message>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { publication } from '@/http/postsAPI';
import { IPublishingPanel } from '@/types';

export default defineComponent({
  data(): IPublishingPanel {
    return {
      loader: false,
      images: [],
      imagePost: [],
      waterMark: false,
      instantPublication: false
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
      try {
        if(!this.imagePost.length){
          (this.$refs.popup as { showMessage: (message: string, duration: number) => void }).showMessage('Некорректные данные', 5000);
          return
        }

        this.loader = true;

        const result = await publication(this.imagePost, this.waterMark, this.instantPublication);
        console.log(result)
        if (result) {
          this.images = [];
          this.imagePost = [];
          (this.$refs.popup as { showMessage: (message: string, duration: number) => void }).showMessage(result, 5000);
        }
      } catch (e: any) {
        (this.$refs.popup as { showMessage: (message: string, duration: number) => void }).showMessage(e.response.data.message, 10000);
      } finally {
        this.loader = false;
      }
    }
  },
})
</script>

<style lang="scss">
.publishing-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  margin-top: 50px;

  &__image {
    background-color: rgb(81, 86, 86);
    border-radius: 15px;
    border: 3px solid grey;
    width: 90%;
    margin-bottom: 50px;
    min-width: 650px;
  }

  &__image-form {
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    width: 100%;
    flex-wrap: wrap;
    gap: 10px;
    overflow-y: auto;
    position: relative;
  }

  &__form {
    height: 40vh;
    width: 25vh;
    object-fit: contain;
    position: relative;
  }

  &__publishes-form {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 20px 0;
    border-top: 3px solid gray;
    border-radius: 10px;
  }

  &__custom-file-upload {
    display: inline-block;
    cursor: pointer;
    font-size: 16px;
    color: #fff;
    background-color: var(--button-color);
    border-radius: 5px;
    padding: 10px 20px;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--button-hover-color);
    }
  }

  #file-upload {
    display: none;
  }
}
</style>