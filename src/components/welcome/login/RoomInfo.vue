<template>
  <fieldset class="root">
    <legend>部屋情報</legend>
    <label>部屋名：<span>{{roomName}}</span></label>
    <label>パスワード：<span>{{roomPassword || "設定なし"}}</span></label>
    <label>招待用URL：<input class="inviteUrl" type="text" readonly="readonly" :value="inviteUrl" />
      <button class="copy" @click="event => doCopy(event)">コピー</button>
    </label>
  </fieldset>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

import { execCopy } from "../../common/Utility";

@Component<RoomInfo>({
  name: "roomInfo"
})
export default class RoomInfo extends Vue {
  @Getter("roomName") roomName: any;
  @Getter("roomPassword") roomPassword: any;
  @Getter("inviteUrl") inviteUrl: any;

  /**
   *
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
}
label {
  display: flex;
  > input {
    flex: 1;
  }
}
</style>
