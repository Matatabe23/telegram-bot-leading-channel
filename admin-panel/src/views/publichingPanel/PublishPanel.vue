<template>
  <div class="publishing-panel">
    <div class="publishing-panel__image">
      <div class="publishing-panel__image-form">
        <div v-for="(photo, index) in state.images" :key="index">
          <img :src="photo" alt="Photo" class="publishing-panel__form">
        </div>
      </div>

      <div class="publishing-panel__publishes-form">

        <div class="publishing-panel__buttons">
          <v-btn color="#5865f2" variant="flat" @click="selectFile">
            <input id="file-upload" type="file" ref="fileInput" multiple @change="handleFileUpload">
            <label for="file-upload" class="publishing-panel__custom-file-upload">
              <i class="fas fa-upload"></i> Загрузить файлы
            </label>
          </v-btn>
          <v-btn color="#5865f2" variant="flat" @click="selectFolder">
            <input type="file" id="file-upload" ref="folderInput" webkitdirectory @change="handleFolderSelection">
            <label class="publishing-panel__custom-file-upload">
              <i class="fas fa-upload"></i> Загрузить несколько папок
            </label>
          </v-btn>

          <v-btn variant="flat" @click="publicationPost" :disabled="state.form.useChannelList.length === 0" color="#5865f2">
            Опубликовать
          </v-btn>
        </div>

        <div class="publishing-panel__selects">
          <div class="publishing-panel__select-settings">
            <v-select label="Настройки" :items="settingsSelectPublish" multiple variant="outlined"
              v-model="state.settingsArray"></v-select>
          </div>
          <div class="publishing-panel__select-settings">
            <v-select label="Каналы для публикации" :items="channelsListSelect" multiple variant="outlined"
              v-model="state.form.useChannelList"></v-select>
          </div>
        </div>

      </div>
    </div>

    <ProcentLoader :overlay="state.processLoader.overlay" :total="state.processLoader.total"
      :loaded="state.processLoader.loaded" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { publication, instantPublicationPosts } from '@/http/postsAPI';
import { IPublish, } from '@/types';
import { useToast } from 'vue-toastification';
import { usePosts } from '@/store/usePosts';
import { settingsSelectPublish } from '@/const';
import { useSettings } from '@/store/useSettings';
import { storeToRefs } from 'pinia';

const settingsStore = useSettings();
const { listChannels } = storeToRefs(settingsStore);


const toast = useToast()
const editorStore = usePosts();

const folderInput = ref('')
const fileInput = ref('')


const state: IPublish = reactive({
  images: [],
  imagePost: [],

  processLoader: {
    overlay: false,
    total: 1,
    loaded: 0,
  },

  settingsArray: [],
  form: {
    useChannelList: []
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

    editorStore.setStateValueByKey('isLoader', true)

    if (state.imagePost.length > 10) {
      toast.error('Не более 10 медиафайлов!')
      return
    }
    let result
    if (state.settingsArray.includes('instantPublication')) {
      result = await instantPublicationPosts(state.imagePost, state.settingsArray.includes('waterMark'), state.form.useChannelList);
    } else {
      result = await publication(state.imagePost, state.settingsArray.includes('waterMark'), state.form.useChannelList);
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
    editorStore.setStateValueByKey('isLoader', false)
  }
}

const getSettings = async () => {
  const settingsArray = localStorage.getItem('settingsArray');
  const useChannelList = localStorage.getItem('useChannelList');
  if (settingsArray !== null && JSON.parse(settingsArray).length > 0) state.settingsArray = JSON.parse(settingsArray).split(',');
  if (useChannelList !== null && JSON.parse(useChannelList).length > 0) state.form.useChannelList = JSON.parse(useChannelList).split(',');
}

const selectFolder = () => {
  folderInput.value.click()
}

const selectFile = () => {
  fileInput.value.click()
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
      await publication(file, state.settingsArray.includes('waterMark'), state.form.useChannelList);
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

watch(() => state.settingsArray, (value) => {
  localStorage.setItem('settingsArray', JSON.stringify(value.join(',')))
}, { deep: true })

watch(() => state.form.useChannelList, (value) => {
  localStorage.setItem('useChannelList', JSON.stringify(value.join(',')))
}, { deep: true })

const channelsListSelect = computed(() =>
  listChannels.value.map(item => ({ title: item.name, value: item.chatId }))
);

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
    // display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px 0;
    border-top: 3px solid gray;
    border-radius: 10px;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__buttons{
    display: flex;
    justify-content: space-around;
    margin-bottom: 15px;
  }

  &__selects{
    display: flex;
    justify-content: space-around;
  }

  &__custom-file-upload {
    display: inline-block;
    font-size: 16px;
    color: #fff;
    border-radius: 5px;
    transition: all 0.3s ease;
    cursor: pointer;
    pointer-events: none;
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

  &__select-settings {
    width: 30%;
    color: #fff;

    .v-input__details {
      min-height: 0;
      padding: 0;
      height: 0;
    }
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