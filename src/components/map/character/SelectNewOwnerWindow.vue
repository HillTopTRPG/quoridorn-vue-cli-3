<template>
  <window-frame
    titleText="キャラクター所有者選択画面"
    display-property="private.display.selectNewOwnerWindow"
    align="center"
    fixSize="280, 130"
    @open="open"
  >
    <div class="container" @contextmenu.prevent>
      <label
        >「{{ characterName }}」<br />の新しいオーナーを選んでください。</label
      >
      <player-select v-model="currentPlayerKey" />
      <div class="operation-area">
        <ctrl-button @click="commit" :disabled="!currentPlayerKey">
          決定
        </ctrl-button>
        <ctrl-button @click="cancel">キャンセル</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";
import CtrlSelect from "../../parts/CtrlSelect.vue";
import PlayerSelect from "../../parts/select/PlayerSelect.vue";
import CtrlButton from "../../parts/CtrlButton.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    PlayerSelect,
    CtrlSelect,
    WindowFrame
  }
})
export default class SelectNewOwnerWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowClose") private windowClose: any;
  @Action("changeListObj") private changeListObj: any;
  @Getter("getObj") private getObj: any;

  private currentPlayerKey: string = "";

  private get objKey() {
    return this.$store.state.private.display["selectNewOwnerWindow"].objKey;
  }

  private get characterName() {
    const character = this.getObj(this.objKey);
    return character ? character.name : "";
  }

  private open() {
    this.currentPlayerKey = "";
  }

  private commit() {
    this.changeListObj({
      key: this.objKey,
      owner: this.currentPlayerKey,
      isNotice: true
    });
    this.windowClose("private.display.selectNewOwnerWindow");
  }

  private cancel() {
    this.windowClose("private.display.selectNewOwnerWindow");
  }
}
</script>

<style scoped lang="scss">
@import "../../common.scss";

.container {
  @include flex-box(column, flex-start, flex-start);
  width: 100%;
  height: 100%;
  font-size: 12px;

  .operation-area {
    @include flex-box(row, center, center);
    align-self: center;
    margin-top: 0.5em;

    *:not(:first-child) {
      margin-left: 0.5em;
    }
  }
}
</style>
