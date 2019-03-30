<template>
  <div
    @mousemove.stop class="loadingScreen"
    v-if="isLoading"
    @contextmenu.prevent
  ></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
export default class ModalScreen extends Vue {
  @Getter("isLoading") private isLoading: any;
}
</script>

<style scoped lang="scss">
.loadingScreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 199999;
}
</style>
