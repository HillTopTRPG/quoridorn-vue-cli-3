
<template>
  <ContextFrame displayProperty="private.display.characterContext">
    <div class="item" @click.left.prevent="viewEditCharacter">変更</div>
    <hr>
    <div class="item" @click.left.prevent="moveToWaitRoom">キャラクター待合室に移動</div>
    <div class="item" @click.left.prevent="moveToGraveyard">墓場に移動（削除）</div>
    <hr>
    <div class="item" @click.left.prevent="copyCharacter">複製</div>
    <hr v-if="url">
    <div class="item" @click.left.prevent="openRefURL" v-if="url">データ参照先URLを開く</div>
  </ContextFrame>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ContextFrame from "../../ContextFrame";
import WindowMixin from "../../WindowMixin";

export default {
  mixins: [WindowMixin],
  components: {
    ContextFrame
  },
  methods: {
    ...mapActions([
      "windowOpen",
      "setProperty",
      "deletePieceInfo",
      "windowClose",
      "changePieceInfo"
    ]),
    viewEditCharacter() {
      qLog(
        `  [methods] select context => item: Character(${
          this.objKey
        }).viewEditCharacter`
      );
      this.setProperty({
        property: "private.display.editCharacterWindow.key",
        value: this.objKey
      });
      this.windowOpen("private.display.editCharacterWindow");
      this.windowClose("private.display.characterContext");
    },
    moveToWaitRoom() {
      this.changePieceInfo({
        propName: "character",
        key: this.objKey,
        place: "waiting",
        isNotice: true
      });
      this.windowClose("private.display.characterContext");
    },
    moveToGraveyard() {
      this.changePieceInfo({
        propName: "character",
        key: this.objKey,
        place: "graveyard",
        isNotice: true
      });
      this.windowClose("private.display.characterContext");
    },
    // deleteCharacter () {
    //   qLog(`  [methods] select context => item: Character(${this.objKey}).deleteCharacter`)
    //   this.deletePieceInfo({ propName: 'character', key: this.objKey, isNotice: true })
    //   this.windowClose('private.display.characterContext')
    // },
    copyCharacter() {
      qLog(
        `  [methods] select context => item: Character(${
          this.objKey
        }).copyCharacter`
      );
      this.windowClose("private.display.characterContext");
      alert("未実装の機能です。");
    },
    openRefURL() {
      // qLog(this.storeObj.url)
      window.open(this.storeObj.url, "_blank");
      this.windowClose("private.display.characterContext");
    }
  },
  computed: mapState({
    ...mapGetters(["getObj"]),
    objKey: state => state.private.display["characterContext"].key,
    url() {
      return this.objKey === -1 ? null : this.storeObj.url;
    },
    storeObj() {
      const key = this.objKey;
      // qLog(`key:${key}`)
      return this.getObj(key);
    }
  })
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
