<template>
  <div id="app">
    <ctrl-button>ぉぅぃぇ</ctrl-button>
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<script lang="ts">
import Vue from "vue";
import CtrlButton from "./components/parts/CtrlButton.vue";
import Component from "vue-class-component";

@Component({
  components: { CtrlButton }
})
export default class ChatLog extends Vue {
  private mounted() {
    window.console.log("call ChatLog#onMount");
  }
}
</script>
