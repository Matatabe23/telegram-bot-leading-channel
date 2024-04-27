<template>
  <div class="publishing-panel">
    <div class="publishing-panel__image" v-if="images.length">
      <div v-for="(photo, index) in images" :key="index">
        <img :src="photo.url" alt="Photo" class="publishing-panel__image__form">
      </div>
    </div>
    <input type="file" multiple @change="handleFileUpload">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { publication } from '@/http/postsAPI';

export default defineComponent({
  data() {
    return {
      images: [] as any,
    };
  },
  methods: {
    async handleFileUpload(event: any) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            this.images.push({
              url: e.target.result,
              file: file,
            });
          }
        };
        reader.readAsDataURL(file);
      }
      console.log(await publication(files));
    },
  },
})
</script>

<style lang="scss">
.publishing-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200vh;
  height: 100vh;

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