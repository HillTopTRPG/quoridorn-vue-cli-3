<template>
  <fieldset class="root">
    <legend>プレイヤー情報</legend>
    <dl>
      <template v-for="player in playerList">
        <dt
          :key="'dt-' + player.key"
          :class="{
            isNotExits: !getMembers(player.key).length,
            isMe: player.key === playerKey
          }"
        >
          {{ player.name }}{{ player.type ? `（${player.type}）` : "" }}
        </dt>
        <dd
          :key="'dd-' + player.key"
          :class="{
            isNotExits: !getMembers(player.key).length,
            isMe: player.key === playerKey
          }"
        >
          <label class="returnUrlArea" v-if="!isWait">
            復帰用URL：
            <input
              class="returnUrl"
              type="text"
              readonly="readonly"
              :value="createUrl(player)"
              @keydown.enter.stop
              @keyup.enter.stop
            />
            <ctrl-button class="copy" @click="doCopy">
              コピー
            </ctrl-button>
          </label>
        </dd>
      </template>
    </dl>
  </fieldset>
</template>

<script lang="ts">
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { execCopy } from "../../common/Utility";

@Component({ components: { CtrlButton } })
export default class RoomInfo extends Vue {
  @Getter("playerList") private playerList: any;
  @Getter("inviteUrl") private inviteUrl: any;
  @Getter("getMembers") private getMembers: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("isWait") private isWait: any;

  createUrl(player: any): string {
    return `${this.inviteUrl}&playerName=${player.name}`;
  }

  /**
   *
   * @param event
   */
  doCopy(event: any): void {
    // const text = event.target.previousElementSibling.value;
    const text = event.target.parentNode.previousElementSibling.value;
    if (!execCopy(text)) {
      alert("テキストをコピーできませんでした。");
    }
    alert(text);
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
}
label {
  display: flex;
  justify-content: center;
  align-items: center;
  > input {
    flex: 1;
  }
}
dl {
  margin: 0;

  .isNotExits {
    background-color: #cccccc;
  }
  .isMe {
    background-color: #cceeee;
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
