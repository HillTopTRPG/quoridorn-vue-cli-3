<template>
  <fieldset class="root">
    <legend>プレイヤー情報</legend>
    <dl>
      <template v-for="player in playerList">
        <dt :key="'dt-' + player.key" :class="{ isNotExits: !getMembers(player.key).length, isMe: player.key === playerKey }">{{player.name}}{{player.type ? `（${player.type}）` : ""}}</dt>
        <dd :key="'dd-' + player.key" :class="{ isNotExits: !getMembers(player.key).length, isMe: player.key === playerKey }">
          <label class="returnUrlArea">復帰用URL：<input class="returnUrl" type="text" readonly="readonly" :value="createUrl(player)"/>
            <button class="copy" @click="event => doCopy(event)">コピー</button>
          </label>
          <ul>
            <template v-for="(member, index) in members">
              <li :key="member.peerId" v-if="member.playerKey === player.key">
                <b v-if="index === 0">[親]</b>
                <b v-if="member.peerId === peerId">[この画面]</b>
                <span>{{member.peerId}}</span>
              </li>
            </template>
          </ul>
        </dd>
      </template>
    </dl>
  </fieldset>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";

import { execCopy } from "../../common/Utility";

@Component<RoomInfo>({
  name: "roomInfo"
})
export default class RoomInfo extends Vue {
  @Getter("playerList") playerList: any;
  @Getter("members") members: any;
  @Getter("peerId") peerId: any;
  @Getter("inviteUrl") inviteUrl: any;
  @Getter("getMembers") getMembers: any;
  @Getter("playerKey") playerKey: any;

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

  .isNotExits {
    background-color: #ccc;
  }
  .isMe {
    background-color: #cee;
  }
}
dt {
  font-weight: bold;
  padding: 0 0 0 0.5em;

  &.isNotExits::before {
    content: "[不在] ";
  }
  &.isMe::before {
    content: "[あなた] ";
  }
}
dd {
  padding: 0 0 0.25em 1rem;
  margin: 0;

  &:not(:last-child) {
    border-bottom: dashed 1px black;
  }
}
ul {
  list-style: none;
  padding: 0;
  margin: 0 0 0 1rem;
}
</style>
