<template>
  <button class="button"><slot></slot></button>
</template>

<script lang="ts">

export default {
  name: 'MainButton'
}
</script>

<style lang="scss">
  .button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: var(--button-color);
    color: var(--button-text-color);
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--button-hover-color);
    }
  }
</style>
