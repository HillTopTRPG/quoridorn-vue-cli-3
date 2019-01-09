
<template>
  <ContextFrame displayProperty="private.display.chitContext">
    <div class="item" @click.left.prevent="viewEditChit">変更</div>
    <div class="item" @click.left.prevent="copyChit">複製</div>
    <div class="item" @click.left.prevent="deleteChit">削除</div>
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
      "windowClose"
    ]),
    viewEditChit() {
      qLog(
        `  [methods] select context => item: Chit(${this.objKey}).viewEditChit`
      );
      this.setProperty({
        property: "private.display.editChitWindow.key",
        value: this.objKey
      });
      this.windowOpen("private.display.editChitWindow");
      this.windowClose("private.display.chitContext");
    },
    copyChit() {
      qLog(`  [methods] select context => item: Chit(${this.objKey}).copyChit`);
      alert("未実装の機能です");
      this.windowClose("private.display.chitContext");
    },
    deleteChit() {
      qLog(
        `  [methods] select context => item: Chit(${this.objKey}).deleteChit`
      );
      this.deletePieceInfo({
        propName: "chit",
        key: this.objKey,
        isNotice: true
      });
      this.windowClose("private.display.chitContext");
    }
  },
  computed: mapState({
    ...mapGetters(["getObj"]),
    objKey: state => state.private.display["chitContext"].key,
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
