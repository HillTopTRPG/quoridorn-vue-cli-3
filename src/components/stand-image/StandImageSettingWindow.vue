<template>
  <WindowFrame titleText="立ち絵設定" display-property="private.display.standImageSettingWindow" align="center" fixSize="653, 400">
    <div class="contents">
      <actor-tab-component v-model="actorKey" @change="changeActor">
        <template slot-scope="{ actor }" v-if="actor">
          <div class="actorSetting">
            <label>表示位置（１：左端、１２：右端）<input type="range" min="1" max="12">()</label>
            <label>ステータス<input type="checkbox"></label>
            <label>
              <select>
              </select>
            </label>
          </div>
          <div class="tab-contents">
            <div class="base">
              <label>ベース</label>
              <img v-img="image" draggable="false" :class="{isReverse : isReverse}" @click="selectBaseImage"/>
              <div>
                <button @click="viewPreview">プレビュー</button>
                <button @click="addDiff">差分追加</button>
              </div>
              <label>サイズの自動調整
                <input
                  type="checkbox"
                  :checked="actor.standImage.autoResize"
                  @change="event => changeAutoResize(event.target.checked)">
              </label>
              <label>アニメーション：
                <input
                  type="number"
                  :value="actor.standImage.animationLength"
                  @change="event => changeAnimationLength(parseInt(event.target.value, 10))"
                  min="0"
                  max="99">
                秒</label>
            </div>
            <div class="diff">
              <label>差分</label>
              <div class="v-scroll">
                <diff-component
                  v-for="(diff, index) in actor.standImage.diffList"
                  :key="index"
                  :actorKey="actor.key"
                  :diff="diff"
                  :index="index"
                  :animationLength="actor.standImage.animationLength"/>
              </div>
            </div>
          </div>
        </template>
      </actor-tab-component>
    </div>
  </WindowFrame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Action, Getter } from "vuex-class";

import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ActorTabComponent from "@/components/parts/ActorTabComponent.vue";
import DiffComponent from "@/components/stand-image/DiffComponent.vue";

@Component<StandImageSettingWindow>({
  name: "standImageSettingWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    ActorTabComponent,
    DiffComponent
  }
})
export default class StandImageSettingWindow extends Vue {
  @Action("setProperty") setProperty: any;
  @Action("windowOpen") windowOpen: any;
  @Action("addStandImageDiff") addStandImageDiff: any;
  @Action("changeListInfo") changeListInfo: any;
  @Getter("imageList") imageList: any;
  @Getter("getObj") getObj: any;

  private actorKey: string = "";

  changeActor(actorKey: string): void {
    this.actorKey = actorKey;
  }

  changeAutoResize(autoResize: boolean) {
    this.changeListInfo({
      key: this.actorKey,
      standImage: {
        autoResize: autoResize
      }
    });
  }

  changeAnimationLength(animationLength: number) {
    this.changeListInfo({
      key: this.actorKey,
      standImage: {
        animationLength: animationLength
      }
    });
  }

  get imageKey(): string | null {
    if (!this.actorKey) return null;
    return this.getObj(this.actorKey).standImage.base;
  }

  get image(): string | null {
    const imageKey = this.imageKey;
    if (!imageKey) return null;
    const imageObj = this.imageList.filter(
      (image: any) => image.key === imageKey.replace(":R", "")
    )[0];
    return imageObj ? imageObj.data : null;
  }

  get isReverse(): boolean {
    const imageKey = this.imageKey;
    if (!imageKey) return false;
    return /:R/.test(imageKey);
  }

  viewPreview(): void {
    alert("viewPreview");
  }

  selectBaseImage(): void {
    const actor = this.getObj(this.actorKey);
    Promise.resolve()
      .then(() =>
        this.setProperty({
          property: "private.display.imageSelectorWindow",
          value: {
            imageKey: null,
            imageTag: null,
            callback: (imageKey: string, imageTag: string) => {
              this.changeListInfo({
                key: this.actorKey,
                standImage: {
                  base: imageKey,
                  baseTag: imageTag
                }
              });
            }
          },
          logOff: true
        })
      )
      .then(() =>
        this.setProperty({
          property: "private.display.imageSelectorWindow",
          value: {
            imageKey: actor.standImage.base,
            imageTag: actor.standImage.baseTag
          },
          logOff: true
        })
      )
      .then(() => {
        this.windowOpen("private.display.imageSelectorWindow");
      });
  }

  addDiff(): void {
    this.addStandImageDiff({
      key: this.actorKey,
      image: "image-1",
      tag: "キャラクター",
      x: 0,
      y: 0,
      size: 100,
      time: [30, 70]
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
}
.actorSetting {
  border-bottom: 1px dotted #666;
}
.base {
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  button {
    margin: 0 0.5em;
  }

  label {
    margin: 0 0.5em;
  }

  input[type="number"] {
    width: 2.5em;
  }

  img {
    margin: 0 0.5em 0.5em;
    border: 1px solid #666;
    width: 12em;
    height: 16em;
    object-fit: contain;
  }
}
.tab-contents {
  display: flex;
  flex-direction: row;
  height: 100%;

  .diff {
    flex: 1;
    display: flex;
    flex-direction: column;

    button {
      display: block;
    }

    .v-scroll {
      overflow-y: scroll;
      flex: 1;

      > div:not(:first-child) {
        margin-top: 0.5em;
      }
    }
  }
}
</style>
