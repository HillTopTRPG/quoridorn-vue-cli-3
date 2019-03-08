<template>
  <fieldset class="root">
    <legend>部屋情報</legend>
    <label>部屋名：<span>{{roomName}}</span></label>
    <label>パスワード：<span>{{roomPassword || "設定なし"}}</span></label>
    <label>システム：<span>{{systemName}}</span></label>
    <div style="color: darkgreen;">※ ログイン情報の暗号化はまだしてないので、いずれ実装します。</div>
    <label v-if="!isWait">招待用URL：<input class="inviteUrl" type="text" readonly="readonly" :value="inviteUrl" />
      <button class="copy" @click="event => doCopy(event)">コピー</button>
    </label>
    <div class="description" v-if="isWait">ここは目的の部屋が作成されるまでの間に滞在する一時的な部屋です。<br>目的の部屋ができたらメッセージ表示の後、自動で部屋を移動します。<br>目的の部屋へのデータ引き継ぎはされません。</div>
  </fieldset>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

import { execCopy } from "../../common/Utility";

@Component<RoomInfo>({
  name: "roomInfo"
})
export default class RoomInfo extends Vue {
  @Action("getBcdiceSystemInfo") getBcdiceSystemInfo: any;
  @Getter("roomName") roomName: any;
  @Getter("roomPassword") roomPassword: any;
  @Getter("inviteUrl") inviteUrl: any;
  @Getter("isWait") isWait: any;
  @Getter("roomSystem") roomSystem: any;

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
    const text = event.target.previousElementSibling.value;
    if (!execCopy(text)) {
      alert("テキストをコピーできませんでした。");
    }
    alert(text);
  }
}
</script>

<style scoped src="./login.css">
</style>

<style scoped lang="scss">
fieldset.root,
fieldset.root > legend {
  background-color: #eec;
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
