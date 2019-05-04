<template>
  <window-frame
    :titleText="title"
    display-property="private.display.unSupportWindow"
    align="center"
    fixSize="200, 120"
  >
    <div class="contents" @contextmenu.prevent>
      <div>未実装の機能です。</div>
      <ctrl-button @click="close">閉じる</ctrl-button>
    </div>
  </window-frame>
</template>

<script>
import CtrlButton from "./parts/CtrlButton";
import { mapState, mapActions } from "vuex";
import WindowFrame from "./WindowFrame";

export default {
  components: {
    CtrlButton,
    WindowFrame
  },
  methods: {
    ...mapActions(["windowClose"]),
    close() {
      this.windowClose("private.display.unSupportWindow");
    }
  },
  computed: mapState({
    title: state => state.private.display.unSupportWindow.title
  })
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: relative;
  height: 100%;

  > * {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}
button {
  bottom: 0;
  height: 30px;
  width: 70px;
}
</style>
