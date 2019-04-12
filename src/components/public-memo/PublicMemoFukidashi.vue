<template>
  <div
    class="public-memo-fukidashi"
    :style="style"
  >
    <span class="title">{{publicMemoObj.title}}</span>
    <ol>
      <li v-for="(tabObj, tabIndex) in publicMemoObj.tabList" :key="tabIndex">
        <span>{{tabObj.tabName}}</span>
        <ul v-if="tabObj.back.contentsList.length">
          <li>表</li>
          <li>裏</li>
        </ul>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class PublicMemoFukidashi extends Vue {
  @Prop({ type: Number, required: true })
  private index!: number;

  @Prop({ type: Object, required: true })
  private publicMemoObj!: any;

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
