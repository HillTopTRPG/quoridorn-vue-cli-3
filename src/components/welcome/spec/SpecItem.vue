<template>
  <fieldset :class="classStr">
    <legend>{{ labelStr }}</legend>
    <ol>
      <slot />
    </ol>
  </fieldset>
</template>

<script>
export default {
  props: {
    classStr: { type: String, required: true },
    labelStr: { type: String, required: true }
  }
};
</script>

<style scoped src="./spec.css"></style>
