<template>
  <div class="main-settings">
    <addingPublicationTimeSettings/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import addingPublicationTimeSettings from '@/components/form/settingsPanel/addingPublicationTimeSettings.vue'

export default defineComponent({
  data() {
    return {

    }
  },
  components:{
    addingPublicationTimeSettings
  }
})
</script>

<style lang="scss">
.main-settings{
  width: 100%;
}
</style>
