<template>
  <div class="main-settings">
    <addingNewChannels @get-list="getList" :listChannels="state.listChannels" />
    <addingPublicationTimeSettings @get-list="getList" :listChannels="state.listChannels" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import addingPublicationTimeSettings from '@/components/form/addingPublicationTimeSettings/addingPublicationTimeSettings.vue'
import addingNewChannels from '@/components/form/addingNewChannels/addingNewChannels.vue'
import { getListChannel } from '@/http/settingsAPI'

const state = reactive({
  listChannels: []
})

const getList = async () => {
  state.listChannels = await getListChannel()
}

getList();
</script>

<style lang="scss">
.main-settings {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
}
</style>
