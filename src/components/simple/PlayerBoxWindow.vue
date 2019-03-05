<template>
  <window-frame titleText="プレイヤーボックス画面" display-property="private.display.playerBoxWindow" align="center" fixSize="300, 400">
    <div class="contents">
      <label class="playerSelect"><player-select v-model="currentPlayerKey"/>のプレイヤーボックス</label>
      <!--<fieldset v-if="currentPlayerKey">-->
        <!--<legend>{{getPlayerName(currentPlayerKey)}}（{{getPlayer ? getPlayer.type : ""}}）</legend>-->
        <label class="playerFontColor">
          チャット文字色
          <input
            type="color"
            :value="getPlayer ? getPlayer.fontColor : ''"
            @change="(event) => changePlayerFontColor(event.target.value, event.target.nextElementSibling.firstElementChild.checked)"
          />
          <label>過去ログ反映<input type="checkbox" checked /></label>
        </label>
        <!-----------------
         ! マップ
         !---------------->
        <fieldset class="field map">
          <legend>マップにいる</legend>
          <ul class="objList">
            <li v-for="character in getMapObjectList({ kind: 'character', place: 'field', playerKey: currentPlayerKey })" :key="character.key">
              <character-chip :type="character.kind" :objKey="character.key" />
              <fieldset class="fontColorArea">
                <legend>チャット文字色</legend>
                <label>
                  <select
                    :value="character.fontColorType"
                    @change="(event) => changeFontColorType(character.key, event.target.value)"
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
              <div class="moveButtons">
                <button @click="movePlace(character.key, 'waiting')">待合室へ</button>
                <button @click="movePlace(character.key, 'graveyard')">墓地へ</button>
              </div>
            </li>
            <!--
            <li v-for="mapMask in getMapObjectList({ kind: 'mapMask', place: 'field', playerKey: currentPlayerKey })" :key="mapMask.key">
              <MapMaskChip :type="mapMask.kind" :objKey="mapMask.key" />
              <div class="moveButtons">
                <button @click="movePlace(mapMask.key, 'field')">マップへ</button>
                <button @click="movePlace(mapMask.key, 'waiting')">待合室へ</button>
              </div>
            </li>
            -->
            <!--
            <li v-for="chit in getMapObjectList({ kind: 'chit', place: 'field', playerKey: currentPlayerKey })" :key="chit.key">
              <ChitChip :type="chit.kind" :objKey="chit.key" />
              <div class="moveButtons">
                <button @click="movePlace(chit.key, 'field')">マップへ</button>
                <button @click="movePlace(chit.key, 'waiting')">待合室へ</button>
              </div>
            </li>
            -->
          </ul>
        </fieldset>
        <!-----------------
         ! キャラクター待合室
         !---------------->
        <fieldset class="field waiting" v-if="currentPlayerKey === playerKey">
          <legend>キャラクター待合室にいる</legend>
          <ul class="objList">
            <li v-for="character in getMapObjectList({ kind: 'character', place: 'waiting', playerKey: currentPlayerKey })" :key="character.key">
              <character-chip :type="character.kind" :objKey="character.key" />
              <div class="moveButtons">
                <button @click="movePlace(character.key, 'field')">マップへ</button>
                <button @click="movePlace(character.key, 'graveyard')">墓地へ</button>
              </div>
            </li>
          </ul>
        </fieldset>
        <!-----------------
         ! 墓場
         !---------------->
        <fieldset class="field graveyard" v-if="currentPlayerKey === playerKey">
          <legend>墓場にいる</legend>
          <ul class="objList">
            <li v-for="character in getMapObjectList({ kind: 'character', place: 'graveyard', playerKey: currentPlayerKey })" :key="character.key">
              <character-chip :type="character.kind" :objKey="character.key" />
              <div class="moveButtons">
                <button @click="movePlace(character.key, 'field')">マップへ</button>
                <button @click="movePlace(character.key, 'waiting')">待合室へ</button>
              </div>
            </li>
            <!--
            <li v-for="mapMask in getMapObjectList({ kind: 'mapMask', place: 'graveyard', playerKey: currentPlayerKey })" :key="mapMask.key">
              <MapMaskChip :type="mapMask.kind" :objKey="mapMask.key" />
              <div class="moveButtons">
                <button @click="movePlace(mapMask.key, 'field')">マップへ</button>
                <button @click="movePlace(mapMask.key, 'waiting')">待合室へ</button>
              </div>
            </li>
            -->
            <!--
            <li v-for="chit in getMapObjectList({ kind: 'chit', place: 'graveyard', playerKey: currentPlayerKey })" :key="chit.key">
              <ChitChip :type="chit.kind" :objKey="chit.key" />
              <div class="moveButtons">
                <button @click="movePlace(chit.key, 'field')">マップへ</button>
                <button @click="movePlace(chit.key, 'waiting')">待合室へ</button>
              </div>
            </li>
            -->
          </ul>
        </fieldset>
      <!--</fieldset>-->
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import CharacterChip from "../map/character/CharacterChip.vue";

import { Action, Getter } from "vuex-class";

import { Component, Vue, Watch } from "vue-property-decorator";
import PlayerSelect from "@/components/parts/select/PlayerSelect.vue";

@Component<PlayerBoxWindow>({
  name: "playerBoxWindow",
  mixins: [WindowMixin],
  components: {
    PlayerSelect,
    WindowFrame,
    CharacterChip
  }
})
export default class PlayerBoxWindow extends Vue {
  @Action("setProperty") setProperty: any;
  @Action("changeChatFontColor") changeChatFontColor: any;
  @Action("changeListInfo") changeListInfo: any;
  @Getter("getObj") getObj: any;
  @Getter("playerKey") playerKey: any;
  @Getter("getMapObjectList") getMapObjectList: any;

  private currentPlayerKey: string = "";

  changeFontColorType(this: any, key: string, value: string): void {
    const characterList = this.getMapObjectList({ kind: "character" });
    const targetCharacter = characterList.filter(
      (character: any) => character.key === key
    )[0];
    if (!targetCharacter) return;
    const index = characterList.indexOf(targetCharacter);
    this.setProperty({
      property: `public.character.list.${index}.fontColorType`,
      value: value,
      isNotice: true,
      logOff: true
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
  movePlace(key: string, place: string): void {
    this.changeListInfo({
      key,
      place,
      isNotice: true
    });
  }
  toWaiting(key: string): void {
    this.changeListInfo({
      key: key,
      place: "field",
      isNotice: true
    });
  }
  toGraveyard(key: string): void {
    this.changeListInfo({
      key: key,
      place: "graveyard",
      isNotice: true
    });
  }

  @Watch("playerKey")
  onChangePlayerKey(playerKey: string) {
    this.currentPlayerKey = playerKey;
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

  &.field {
    border-width: 2px;
    border-style: solid;
    &.map {
      border-color: blue;
    }
    &.waiting {
      border-color: green;
    }
    &.graveyard {
      border-color: magenta;
    }
  }
  legend {
    font-weight: bold;
  }

  &.fontColorArea {
    border: none;
    padding: 0;

    label {
      display: flex;
      flex-direction: row;
    }
  }
}
.playerSelect {
  display: block;
}
.playerFontColor {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: baseline;
  margin-bottom: 0.5rem;
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
button {
  border-radius: 5px;
}
ul {
  margin: 0;
  list-style: none;
  padding: 0 0.5rem 0 0;

  &.objList > li {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: flex-end;

    &:not(:last-child) {
      border-bottom: 1px dashed black;
      padding-bottom: 0.5em;
      margin-bottom: 0.2em;
    }

    > *:not(:last-child) {
      margin-right: 1em;
    }

    .moveButtons {
      display: flex;
      flex-direction: column;

      button:not(:last-child) {
        margin-bottom: 0.5em;
      }
    }

    .character {
      margin-top: 1em;
      margin-right: 0.5rem;
    }
  }
}
</style>
