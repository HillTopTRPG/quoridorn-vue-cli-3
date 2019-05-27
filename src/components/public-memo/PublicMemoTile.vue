<template>
  <div
    class="public-memo-tile"
    :style="style"
    @click.left="tileOnClick"
    v-bg-img="'static/img/map/memo2.png'"
    @click.right.prevent="openContext"
    @contextmenu.prevent
  >{{ publicMemoObj.title }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({})
export default class PublicMemoTile extends Vue {
  @Prop({ type: Number, required: true })
  private index!: number;

  @Prop({ type: Object, required: true })
  private publicMemoObj!: any;

  @Action("setProperty") private setProperty: any;
  @Action("windowOpen") private windowOpen: any;

  private tileOnClick() {
    this.setProperty({
      property: `private.display.publicMemoWindow`,
      value: {
        objKey: this.publicMemoObj.key,
        isEditMode: false
      },
      isNotice: false,
      logOff: true
    });
    this.windowOpen("private.display.publicMemoWindow");
  }

  private openContext(event: any): void {
    let pageX = event.pageX;
    let pageY = event.pageY;

    const key: string = this.publicMemoObj.key;
    const contextProperty: string = "private.display.publicMemoContext";

    const obj = {
      objKey: key,
      x: pageX,
      y: pageY
    };
    this.setProperty({
      property: contextProperty,
      value: obj,
      logOff: true
    }).then(() => this.windowOpen(contextProperty));
  }

  private get style(): any {
    return {
      top: `calc(3rem + ${this.index % 3} * 4rem)`,
      left: `calc(1rem + ${Math.floor(this.index / 3)} * 4rem)`
    };
  }
}
</script>

<style scoped lang="scss">
.public-memo-tile {
  position: absolute;
  width: 3em;
  height: 3em;
  overflow: hidden;
  background-color: white;
  border: solid 3px #00aaaa;
  border-radius: 2px;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.5em;
  background-size: 100% 100%;

  &:hover {
    transform: scale(1.1, 1.1);
    transform-origin: left top;
  }
}
</style>
