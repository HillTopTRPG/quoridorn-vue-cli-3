<template>
  <fieldset class="root">
    <legend>部屋情報</legend>
    <label>部屋名：<span>{{roomName}}</span></label>
    <label>パスワード：<span>{{roomPassword || "設定なし"}}</span></label>
    <label
      class="inviteUrlArea"
      v-if="playerList.length > 0"
    >招待用URL：<input class="inviteUrl" type="text" readonly="readonly" :value="inviteUrl" />
      <button class="copy" @click="event => doCopy(event)">コピー</button>
    </label>
    <dl>
      <template v-for="player in playerList">
        <dt :key="'dt-' + player.key">{{player.name}}</dt>
        <dd :key="'dd-' + player.key">
          <label class="returnUrlArea">復帰用URL：<input class="returnUrl" type="text" readonly="readonly" :value="createUrl(player)"/>
            <button class="copy" @click="event => doCopy(event)">コピー</button>
          </label>
          <dl>
            <dt>peerId</dt>
            <template v-for="(member, index) in members">
              <dd :key="member.peerId" v-if="member.playerKey === player.key">
                <b v-if="index === 0">[親]</b>
                <b v-if="member.peerId === peerId">[この画面]</b>
                <span>{{member.peerId}}</span>
              </dd>
            </template>
          </dl>
        </dd>
      </template>
    </dl>
    <button type="button" @click="commit"><i class="icon-home3"></i> なんかのボタン</button>
  </fieldset>
</template>

<script lang="ts">
// import { Action } from "vuex-class";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";

import { execCopy } from "../../common/Utility";

@Component<RoomInfo>({
  name: "roomInfo"
})
export default class RoomInfo extends Vue {
  @Getter("playerList") playerList: any;
  @Getter("members") members: any;
  @Getter("roomName") roomName: any;
  @Getter("roomPassword") roomPassword: any;
  @Getter("peerId") peerId: any;
  @Getter("inviteUrl") inviteUrl: any;
  // @Action("setProperty") setProperty: any;
  // @Action("emptyMember") emptyMember: any;
  // @Action("windowClose") windowClose: any;
  // @Action("checkRoomName") checkRoomName: any;
  //
  // /*
  //  * data
  //  */
  // private roomName: string = "";

  /**
   * 確定ボタン押下時
   */
  commit(): void {
    // TODO
  }

  createUrl(player: any): string {
    return `${this.inviteUrl}&playerName=${player.name}`;
  }

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
dl {
  margin: 0;
}
dt {
  font-weight: bold;
}
dd {
  margin: 0 0 0 1rem;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0 0 0 1rem;
}
</style>
