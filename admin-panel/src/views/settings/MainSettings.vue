<template>
  <div class="main-settings">
    <addingNewChannels />
    <addingPublicationTimeSettings/>
  </div>
</template>

<script lang="ts" setup>
import addingPublicationTimeSettings from '@/components/form/addingPublicationTimeSettings/addingPublicationTimeSettings.vue'
import addingNewChannels from '@/components/form/addingNewChannels/addingNewChannels.vue'
import { useSettings } from '@/store/useSettings';

const settingsStore = useSettings();
settingsStore.getListChannels();
</script>

<style lang="scss">
.main-settings {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
}
</style>
