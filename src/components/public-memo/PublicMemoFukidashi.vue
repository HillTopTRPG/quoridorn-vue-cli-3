<template>
  <div
    class="public-memo-fukidashi"
    :style="style"
  >
    <span class="title" v-html="publicMemoObj.title.replace(/\n/g, '<br>')"></span>
    <ol>
      <li v-for="(tabObj, tabIndex) in publicMemoObj.tabList" :key="tabIndex">
        <span>{{tabObj.tabName}}</span>
        <template v-if="!tabObj.back.contentsList.length && isHide(tabObj.front)">
          <br><span>（閲覧不可）</span>
        </template>
        <ul v-if="tabObj.back.contentsList.length">
          <li>
            <span>表</span>
            <span v-if="isHide(tabObj.front)">（閲覧不可）</span>
          </li>
          <li>
            <span>裏</span>
            <span v-if="isHide(tabObj.back)">（閲覧不可）</span>
          </li>
        </ul>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({})
export default class PublicMemoFukidashi extends Vue {
  @Prop({ type: Number, required: true })
  private index!: number;

  @Prop({ type: Object, required: true })
  private publicMemoObj!: any;

  @Getter("playerKey") playerKey: any;
  @Getter("getObj") getObj: any;

  private isHide(surface: any) {
    // ターゲットが指定されていないなら公開情報
    if (surface.targetList.length === 0) return false;

    // ターゲットが指定されているので、許可されているか調べる
    return !this.getTargetActorList(surface).filter(actor => {
      const type: string = actor.key.split("-")[0];
      if (type === "character") {
        return actor.owner === this.playerKey;
      } else {
        return actor.key === this.playerKey;
      }
    })[0];
  }

  private getTargetActorList(surface: any): any[] {
    return surface.targetList.map((actorKey: string) => this.getObj(actorKey));
  }

  private get style(): any {
    return {
      top: `calc(3rem + ${this.index % 3} * 4rem)`,
      left: `calc(4.3rem + 6px + ${Math.floor(this.index / 3)} * 4rem)`
    };
  }
}
</script>

<style scoped lang="scss">
.public-memo-fukidashi {
  position: absolute;
  background-color: lightyellow;
  border: solid 1px black;
  border-radius: 2px;
  visibility: hidden;
  z-index: 100;
  font-size: 13px;
  padding: 0.5em 2em 0.5em 0.5em;

  ul,
  ol {
    margin: 0;
    padding: 0 0 0 1.5em;
  }

  .title {
    font-weight: bold;
  }
}
</style>
