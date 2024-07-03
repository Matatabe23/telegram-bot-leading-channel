<template>
  <div class="publishing-panel">
    <div class="publishing-panel__image">
      <div class="publishing-panel__image-form">
        <div v-for="(photo, index) in state.images" :key="index">
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
        <div>
          <input type="file" id="file-upload" ref="folderInput" webkitdirectory @change="handleFolderSelection">
          <label @click="selectFolder" class="publishing-panel__custom-file-upload">
            <i class="fas fa-upload"></i> Загрузить несколько папок
          </label>
        </div>

        <MainButton @click="state.isSettingsPanelOpen = !state.isSettingsPanelOpen">Настройки</MainButton>
        <MainButton @click="publicationPost">Опубликовать</MainButton>

      </div>
    </div>

    <div class="publishing-panel__settings-panel" v-if="state.isSettingsPanelOpen">
      <div class="publishing-panel__close" @click="state.isSettingsPanelOpen = !state.isSettingsPanelOpen">✖</div>
      <MainCheckBox label="Водяной знак" height="20px" v-model="state.waterMark" />
      <MainCheckBox label="Опубликовать сразу" height="20px" v-model="state.instantPublication" />
    </div>

    <div class="publishing-panel__overlay" v-if="state.isSettingsPanelOpen"
      @click="state.isSettingsPanelOpen = !state.isSettingsPanelOpen" />
    <Loader v-if="state.loader" />

    <ProcentLoader :overlay="state.processLoader.overlay" :total="state.processLoader.total"
      :loaded="state.processLoader.loaded" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { publication, instantPublicationPosts } from '@/http/postsAPI';
import { IPublish } from '@/types';
import { useToast } from 'vue-toastification';
import { usePosts } from '@/store/usePosts';
import { storeToRefs } from 'pinia';


const toast = useToast()
const editorStore = usePosts();
const { postsList, totalCount, publishTime, isLoader, form } = storeToRefs(editorStore);

const folderInput = ref('')

const state: IPublish = reactive({
  loader: false,
  isSettingsPanelOpen: false,
  images: [],
  imagePost: [],
  waterMark: false,
  instantPublication: false,

  processLoader: {
    overlay: false,
    total: 1,
    loaded: 0,
  }
})

const handleFileUpload = async (event: any) => {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        state.images.push(reader.result);
      }
    };
    state.imagePost.push(file)
    reader.readAsDataURL(file);
  }
}

const publicationPost = async () => {
  try {
    if (!state.imagePost.length) {
      toast.error('Некорректные данные')
      return
    }

    state.loader = true;

    if (state.imagePost.length > 10) {
      toast.error('Не более 10 медиафайлов!')
      return
    }
    let result
    if (state.instantPublication) {
      result = await instantPublicationPosts(state.imagePost, state.waterMark);
    } else {
      result = await publication(state.imagePost, state.waterMark);
    }

    if (result) {
      state.images = [];
      state.imagePost = [];
      toast.success(result)
    }
    editorStore.getPosts()
  } catch (e: any) {
    toast.error(e.response.data.message)
  } finally {
    state.loader = false;
  }
}

const getSettings = async () => {
  const waterMarkString = localStorage.getItem('waterMark');
  const instantPublication = localStorage.getItem('instantPublication');
  if (waterMarkString !== null) {
    state.waterMark = JSON.parse(waterMarkString);
  }
  if (instantPublication !== null) {
    state.instantPublication = JSON.parse(instantPublication);
  }
}

const selectFolder = () => {
  folderInput.value.click()
}

const handleFolderSelection = async (event: any) => {
  try {
    const files = event.target.files;
    if (files.length === 0) return;

    const groupedFiles: any = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const match = file.webkitRelativePath.match(/\/(\d+)\//);
      const number = match ? parseInt(match[1]) : null;

      if (!number) {
        toast.error('Ошибка в работе с файлами')
        return
      }


      if (number !== null) {
        if (!groupedFiles[number]) {
          groupedFiles[number] = [];
        }
        groupedFiles[number].push(file);
      }
    }

    const folderContent = Object.values(groupedFiles);

    state.processLoader.overlay = true
    state.processLoader.total = folderContent.length

    for (let i = 0; i < folderContent.length; i++) {
      const file = folderContent[i] as FileList;
      await publication(file, state.waterMark);
      state.processLoader.loaded += 1
    }

    editorStore.getPosts()
    toast.success('Успешная публикация')
  } catch (e: any) {
    toast.error(e.response.data.message)
  } finally {
    state.processLoader.overlay = false
  }
}

watch(() => state.waterMark, (value) => {
  localStorage.setItem('waterMark', JSON.stringify(value))
})

watch(() => state.instantPublication, (value) => {
  localStorage.setItem('instantPublication', JSON.stringify(value))
})

onMounted(() => {
  getSettings()
})
</script>

<style lang="scss">
.publishing-panel {
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

  &__settings-panel {
    position: fixed;
    background-color: rgb(100, 100, 100);
    width: 500px;
    min-height: 200px;
    border-radius: 20px;
    gap: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    justify-items: center;
    align-items: center;
    padding: 10px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
  }

  &__close {
    position: absolute;
    right: 0;
    top: 0;
    margin: 10px 10px 0 0;
    cursor: pointer;
  }
}
</style>