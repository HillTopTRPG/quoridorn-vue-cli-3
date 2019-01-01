<template>
  <div @mousemove.stop class="loadingScreen" v-if="isLoading"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({
  name: "loadingScreen"
})
export default class MordalScreen extends Vue {
  @Getter("isLoading") isLoading: any;
}
</script>

<style scoped>
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
