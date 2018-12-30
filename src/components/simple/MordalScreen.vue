<template>
  <div class="mordalScreen" v-if="isMordal"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({
  name: "mordalScreen"
})
export default class MordalScreen extends Vue {
  @Getter("isMordal") isMordal: any;
}
</script>

<style scoped>
.mordalScreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: rgba(0, 0, 0, 0.4);
}
</style>
