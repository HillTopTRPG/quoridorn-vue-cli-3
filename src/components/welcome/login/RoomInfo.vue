<template>
  <fieldset class="root">
    <legend>部屋情報</legend>
    <label>
      部屋名：
      <span>{{ roomName }}</span>
    </label>
    <label>
      パスワード：
      <span>{{ roomPassword || "設定なし" }}</span>
    </label>
    <label>
      システム：
      <span>{{ systemName }}</span>
    </label>
    <div style="color: darkgreen;">
      ※ ログイン情報の暗号化はまだしてないので、いずれ実装します。
    </div>
    <label v-if="!isWait">
      招待用URL：
      <input
        class="inviteUrl"
        type="text"
        readonly="readonly"
        :value="inviteUrl"
      />
      <ctrl-button class="copy" @click="doCopy">コピー</ctrl-button>
    </label>
    <div class="description" v-if="isWait">
      ここは目的の部屋が作成されるまでの間に滞在する一時的な部屋です。
      <br />目的の部屋ができたらメッセージ表示の後、自動で部屋を移動します。
      <br />目的の部屋へのデータ引き継ぎはされません。
    </div>
  </fieldset>
</template>

<script lang="ts">
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { execCopy } from "../../common/Utility";

@Component({ components: { CtrlButton } })
export default class RoomInfo extends Vue {
  @Action("getBcdiceSystemInfo") private getBcdiceSystemInfo: any;
  @Getter("roomName") private roomName: any;
  @Getter("roomPassword") private roomPassword: any;
  @Getter("inviteUrl") private inviteUrl: any;
  @Getter("isWait") private isWait: any;
  @Getter("roomSystem") private roomSystem: any;

  private systemName: string = "";

  @Watch("roomSystem", { immediate: true })
  onChangeRoomSystem(roomSystem: string) {
    this.getBcdiceSystemInfo(roomSystem)
      .then((info: any) => {
        this.systemName = info.name;
      })
      .catch((err: any) => {
        window.console.error(err);
        this.systemName = "ダイスボット名の取得に失敗しました。";
      });
  }

  /**
   * テキストをクリップボードにコピーする
   * @param event
   */
  doCopy(event: any): void {
    const text = event.target.parentNode.previousElementSibling.value;
    if (!execCopy(text)) {
      alert("テキストをコピーできませんでした。\n" + text);
    } else {
      alert(text);
    }
  }
}
</script>

<style scoped src="./login.css"></style>

<style scoped lang="scss">
fieldset.root,
fieldset.root > legend {
  background-color: #eeeecc;
}
.description {
  text-align: left;
  color: red;
}
label {
  display: flex;
  > input {
    flex: 1;
  }
}
</style>
