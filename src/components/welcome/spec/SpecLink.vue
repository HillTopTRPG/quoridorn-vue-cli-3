<template>
  <a :href="refProp" @click="openLink(property)" :title="titleStr"><slot></slot></a>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    property: { type: String, required: true },
    titleStr: { type: String, required: true }
  },
  methods: {
    openLink(id) {
      const elm = document
        .getElementById("welcomeWindowContents")
        .querySelector("#" + id);
      if (!elm) {
        window.console.error(`Not found => #${id}`);
        return;
      }
      if (!elm.checked) elm.click();
    }
  },
  computed: mapState({
    refProp() {
      return "#ref_" + this.property;
    }
  })
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  text-decoration: none;

  &:link,
  &:visited,
  &:hover,
  &:active {
    color: rgb(53, 108, 165);
  }
}
</style>
