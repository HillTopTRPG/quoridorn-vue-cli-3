<template>
  <WindowFrame titleText="プレイヤーボックス画面" display-property="private.display.playerBoxWindow" align="center" fixSize="300, 400">
    <div class="contents">
      <label>
        <select v-model="currentPlayerKey">
          <option v-for="player in playerList" :key="player.key" :value="player.key">{{player.name}}</option>
        </select>
      </label>
      <fieldset v-if="currentPlayerKey">
        <legend>{{getPlayerName(currentPlayerKey)}}({{getPlayer ? getPlayer.type : ""}})</legend>
        <label>
          チャット文字色
          <input
            type="color"
            :value="getPlayer ? getPlayer.fontColor : ''"
            @change="event => changePlayerFontColor(event.target.value, event.target.nextElementSibling.firstElementChild.checked)"
          />
          <label>過去ログ反映<input type="checkbox" checked /></label>
        </label>
        <!-----------------
         ! 接続(peerId)
         !---------------->
        <fieldset>
          <legend>接続(peerId)</legend>
          <ul>
            <li v-for="member in getMembers(currentPlayerKey)" :key="member.peerId">{{member.peerId}}
              <span v-if="member.peerId === peerId">(この画面)</span>
            </li>
          </ul>
        </fieldset>
        <!-----------------
         ! マップ
         !---------------->
        <fieldset>
          <legend>マップ</legend>
          <ul class="objList">
            <li v-for="character in getMapObjectList('character', currentPlayerKey, 'field')" :key="character.key">
              <CharacterChip :type="character.kind" :objKey="character.key" />
              <fieldset class="fontColorArea">
                <legend>チャット文字色</legend>
                <label>
                  <select
                    :value="character.fontColorType"
                    @change="event => changeFontColorType(character.key, Number(event.target.value))"
                  >
                    <option value="0">主と同じ</option>
                    <option value="1">個別</option>
                  </select>
                  <input
                    type="color"
                    :value="character.fontColorType === 0 ? getPlayer ? getPlayer.fontColor : '' : character.fontColor"
                    @change="event => changeCharacterFontColor(character.key, event.target.value, event.target.parentNode.nextElementSibling.firstElementChild.checked)"
                    :disabled="character.fontColorType === 0"/>
                </label>
                <label>過去ログ反映<input type="checkbox" checked /></label>
              </fieldset>
            </li>
            <li v-for="mapMask in getMapObjectList('mapMask', currentPlayerKey, 'field')" :key="mapMask.key">
              <MapMaskChip :type="mapMask.kind" :objKey="mapMask.key" />
            </li>
            <li v-for="chit in getMapObjectList('chit', currentPlayerKey, 'field')" :key="chit.key">
              <ChitChip :type="chit.kind" :objKey="chit.key" />
            </li>
          </ul>
        </fieldset>
        <!-----------------
         ! キャラクター待合室
         !---------------->
        <fieldset v-if="playerType === 'GM' || currentPlayerKey === playerKey">
          <legend>キャラクター待合室</legend>
          <ul class="objList">
            <li v-for="character in getMapObjectList('character', currentPlayerKey, 'waiting')" :key="character.key">
              <CharacterChip :type="character.kind" :objKey="character.key" />
              <button @click="toMap(character.key)">マップへ</button>
            </li>
          </ul>
        </fieldset>
        <!-----------------
         ! 墓場
         !---------------->
        <fieldset v-if="playerType === 'GM' || currentPlayerKey === playerKey">
          <legend>墓場</legend>
          <ul class="objList">
            <li v-for="character in getMapObjectList('character', currentPlayerKey, 'graveyard')" :key="character.key">
              <CharacterChip :type="character.kind" :objKey="character.key" />
              <button @click="toMap(character.key)">マップへ</button>
            </li>
            <li v-for="mapMask in getMapObjectList('mapMask', currentPlayerKey, 'graveyard')" :key="mapMask.key">
              <MapMaskChip :type="mapMask.kind" :objKey="mapMask.key" />
              <button @click="toMap(mapMask.key)">マップへ</button>
            </li>
            <li v-for="chit in getMapObjectList('chit', currentPlayerKey, 'graveyard')" :key="chit.key">
              <ChitChip :type="chit.kind" :objKey="chit.key" />
              <button @click="toMap(chit.key)">マップへ</button>
            </li>
          </ul>
        </fieldset>
      </fieldset>
    </div>
  </WindowFrame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import CharacterChip from "../map/character/CharacterChip.vue";

import { Action, Getter } from "vuex-class";

import { Component, Vue } from "vue-property-decorator";

@Component<PlayerBoxWindow>({
  name: "playerBoxWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    CharacterChip
  }
})
export default class PlayerBoxWindow extends Vue {
  @Action("imageTagChange") imageTagChange: any;
  @Action("addImage") addImage: any;
  @Action("windowClose") windowClose: any;
  @Action("emptyProperty") emptyProperty: any;
  @Action("setProperty") setProperty: any;
  @Action("getPieceObj") getPieceObj: any;
  @Action("changeChatFontColor") changeChatFontColor: any;
  @Action("changePieceInfo") changePieceInfo: any;
  @Getter("getObj") getObj: any;
  @Getter("members") members: any;
  @Getter("playerList") playerList: any;
  @Getter("characterList") characterList: any;
  @Getter("peerId") peerId: any;
  @Getter("playerType") playerType: any;
  @Getter("playerKey") playerKey: any;
  @Getter("getMapObjectList") getMapObjectList: any;
  @Getter("getMembers") getMembers: any;

  private currentPlayerKey: string = "";

  changeFontColorType(this: any, key: string, value: string): void {
    const targetCharacter = this.characterList.filter(
      (character: any) => character.key === key
    )[0];
    if (!targetCharacter) return;
    const index = this.characterList.indexOf(targetCharacter);
    this.setProperty({
      property: `public.character.list.${index}.fontColorType`,
      value: value,
      isNotice: true,
      logOff: false
    });
  }
  changeCharacterFontColor(
    this: any,
    key: string,
    value: boolean,
    historyChange: boolean
  ): void {
    this.changeChatFontColor({
      key: key,
      color: value,
      historyChange: historyChange
    });
  }
  changePlayerFontColor(
    this: any,
    value: string,
    historyChange: boolean
  ): void {
    const targetPlayer = this.getPlayer;
    window.console.log(targetPlayer.name, targetPlayer.key);
    this.changeChatFontColor({
      key: targetPlayer.key,
      color: value,
      historyChange: historyChange
    });
  }
  getPlayerName(this: any, playerKey: string): string {
    const player = this.getObj(playerKey);
    if (!player) return "";
    return player.name;
  }
  toMap(key: string): void {
    const kind = key.split("-")[0];
    this.changePieceInfo({
      propName: kind,
      key: key,
      place: "field",
      isNotice: true
    });
  }

  get getPlayer(): any {
    return this.getObj(this.currentPlayerKey);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: scroll;

  font-size: 12px;
}
fieldset {
  padding: 0 0.5rem 0.5rem;
}
li {
  position: relative;
}
input[type="color"] {
  width: 2rem;
  height: 1.5rem;
  padding: 0 0.2rem;
  box-sizing: border-box;
}
select {
  height: 1.5rem;
}
.fontColorArea label {
  display: flex;
  flex-direction: row;
}
ul {
  margin: 0;
  padding: 0 0.5rem;

  &.objList {
    list-style: none;
    padding-left: 0;

    > li {
      display: flex;
      flex-direction: row;
      justify-content: left;
      align-items: center;

      .character {
        margin-top: 1em;
        margin-right: 0.5rem;
      }
    }
  }
}
</style>
