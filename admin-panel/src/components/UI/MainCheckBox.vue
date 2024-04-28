<template>
  <div class="main-check-box" @click="setCheckBox()">
    <input type="checkbox" :checked="modelValue" :style="{ width: width, height: height }">
    {{ label }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainCheckBox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '20px'
    },
    width: {
      type: String,
      default: '20px'
    }
  },
  methods: {
    setCheckBox() {
      this.$emit('update:modelValue', !this.modelValue)
    }
  }
})
</script>

<style lang="scss">
.main-check-box {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  color: white;
  background-color: var(--button-color);
  cursor: pointer;
  user-select: none;
}
</style>
