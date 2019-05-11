<template>
  <window-frame
    titleText="立ち絵設定"
    display-property="private.display.standImageSettingWindow"
    align="center"
    fixSize="676, 540"
  >
    <div class="contents">
      <actor-tab-component @change="changeActor">
        <actor-status-tab-component slot-scope="{ actor }" v-if="actor" :actor="actor" @change="changeStatus" ref="actorStatusTabComponent">
          <template slot-scope="{ status }" v-if="status">
            <div class="actorSetting">
              <label>
                データ
                <actor-other-status-select
                  :actor="actor"
                  :statusName="status.name"
                  :value="status.standImage.ref"
                  :disabled="status.standImage.isSystemLock"
                  @input="changeRef"
                />
              </label>

              <span
                class="delete-button"
                @click.prevent="doDeleteActorStatus({ key: actorKey, statusName: status.name })"
                v-if="!status.standImage.isSystemLock"
              >状態の削除</span>
            </div>
            <div class="tab-contents">
              <div class="disable-overlay" v-if="status.standImage.ref || status.standImage.isSystemLock">
                <span v-if="status.standImage.ref">状態「{{status.standImage.ref}}」のデータを参照しています</span>
                <span v-if="status.standImage.isSystemLock">初期データとして必要なため<br>編集できません</span>
              </div>
              <div class="base">
                <label>ベース</label>

                <!-- ベース画像 -->
                <stand-image-component
                  :standImage="getViewStatus(status).standImage"
                  :drawDiff="isPreview"
                  @click="selectBaseImage"
                  @resize="onBaseResize"
                />

                <div>
                  <label>プレビュー
                    <input
                      type="checkbox"
                      v-model="isPreview"
                      :disabled="status.standImage.isSystemLock"
                    >
                  </label>
                  <ctrl-button
                    @click="addDiff()"
                    :disabled="status.standImage.isSystemLock"
                  >差分追加</ctrl-button>
                </div>
                <label>サイズの自動調整
                  <input
                    type="checkbox"
                    :checked="getViewStatus(status).standImage.autoResize"
                    @change="event => changeAutoResize(event.target.checked)"
                    :disabled="status.standImage.isSystemLock || true"
                  >
                </label>
                <label>アニメーション：
                  <input
                    type="number"
                    :value="getViewStatus(status).standImage.animationLength"
                    @change="event => changeAnimationLength(parseInt(event.target.value, 10))"
                    min="0"
                    max="99"
                    :disabled="status.standImage.isSystemLock"
                  >
                  秒</label>
                <!--
                -->
                <label>表示位置（{{getViewStatus(status).standImage.locate}}）</label>
                <label>
                  左
                  <input
                    type="range"
                    min="1"
                    max="12"
                    :value="getViewStatus(status).standImage.locate"
                    @input="event => changeLocate(parseInt(event.target.value, 10))"
                    :disabled="status.standImage.isSystemLock"
                  >右
                </label>
              </div>
              <div class="diff">
                <label>差分</label>
                <div class="v-scroll">
                  <diff-component
                    v-for="(diff, index) in getViewStatus(status).standImage.diffList"
                    :key="index"
                    :actorKey="actor.key"
                    :statusName="getViewStatus(status).name"
                    :diff="diff"
                    :index="index"
                    :animationLength="getViewStatus(status).standImage.animationLength"
                    ref="diffList"/>
                </div>
              </div>
            </div>
          </template>
        </actor-status-tab-component>
      </actor-tab-component>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import ActorTabComponent from "@/components/parts/ActorTabComponent.vue";
import ActorStatusTabComponent from "@/components/parts/ActorStatusTabComponent.vue";
import DiffComponent from "@/components/stand-image/DiffComponent.vue";
import ActorOtherStatusSelect from "@/components/parts/select/ActorOtherStatusSelect.vue";
import StandImageComponent from "@/components/parts/StandImageComponent.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { removeExt } from "@/components/common/Utility";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    ActorOtherStatusSelect,
    WindowFrame,
    ActorTabComponent,
    ActorStatusTabComponent,
    DiffComponent,
    StandImageComponent
  }
})
export default class StandImageSettingWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("setProperty") private setProperty: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("addStandImageDiff") private addStandImageDiff: any;
  @Action("deleteActorStatus") private deleteActorStatus: any;
  @Action("changeListObj") private changeListObj: any;
  @Getter("imageList") private imageList: any;
  @Getter("getObj") private getObj: any;

  private actorKey: string = "";
  private statusName: string | null = "";
  private isPreview: boolean = true;
  private baseSize: any = { w: 0, h: 0 };

  changeActor(actorKey: string): void {
    this.actorKey = actorKey;
  }

  doDeleteActorStatus(key: string, statusName: string) {
    const comp: ActorStatusTabComponent = this.$refs
      .actorStatusTabComponent as ActorStatusTabComponent;
    this.statusName = comp.deleteTab();
    this.deleteActorStatus(key, statusName);
  }

  getViewStatus(status: any) {
    const useName = status.standImage.ref || this.statusName;
    const actor = this.getObj(this.actorKey);

    return actor.statusList.filter((status: any) => status.name === useName)[0];
  }

  private updateStatus(standImage: any) {
    const actor: any = this.getObj(this.actorKey);
    const statusIndex: number = actor.statusList.findIndex(
      (status: any) => status.name === this.statusName
    );
    const updateStatusList: any = {};
    updateStatusList[statusIndex] = {
      standImage: standImage
    };

    setTimeout(() =>
      this.changeListObj({
        key: this.actorKey,
        statusList: updateStatusList
      })
    );
  }

  changeRef(ref: string): void {
    this.updateStatus({ ref });
  }

  changeStatus(statusName: string): void {
    this.statusName = statusName;
  }

  changeAutoResize(autoResize: boolean) {
    this.updateStatus({
      autoResize: autoResize
    });
  }

  changeLocate(locate: number) {
    this.updateStatus({
      locate: locate
    });
  }

  changeAnimationLength(animationLength: number) {
    this.updateStatus({
      animationLength: animationLength
    });
  }

  get imageKey(): string | null {
    if (!this.actorKey) return null;
    if (!this.statusName) return null;

    const statusList: any[] = this.getObj(this.actorKey).statusList;
    const status = statusList.filter(
      (status: any) => status.name === this.statusName
    )[0];

    return this.getViewStatus(status).standImage.base;
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

  selectBaseImage(): void {
    const actor = this.getObj(this.actorKey);
    const statusIndex = actor.statusList.findIndex(
      (status: any) => status.name === this.statusName
    );
    const status = actor.statusList[statusIndex];
    const base = status.standImage.base;
    const baseTag = status.standImage.baseTag;
    Promise.resolve()
      .then(() =>
        // リアクティブのための更新と、それに伴うコールバックの一時無効のための指定
        this.setProperty({
          property: "private.display.imageSelectorWindow",
          value: {
            imageKey: null,
            imageTag: null,
            callback: null
          },
          logOff: true
        })
      )
      .then(() =>
        this.setProperty({
          property: "private.display.imageSelectorWindow",
          value: {
            imageKey: base,
            imageTag: baseTag,
            callback: (imageKey: string, imageTag: string) => {
              if (this.imageKey === imageKey) return;

              const arg = {
                base: imageKey,
                baseTag: imageTag
              };

              this.updateStatus(arg);

              const isReverse: boolean = /:R/.test(imageKey);

              // 画像のファイル名の情報を利用
              const baseImage: any = this.imageList.filter(
                (image: any) => image.key === imageKey.replace(":R", "")
              )[0];
              if (baseImage) {
                const baseImageName: string = removeExt(baseImage.name);
                const diffImageList: any[] = this.imageList.filter(
                  (image: any) =>
                    image.key !== imageKey.replace(":R", "") &&
                    image.name.startsWith(baseImageName)
                );
                const diffList: DiffComponent[] | undefined = <
                  Array<DiffComponent>
                >this.$refs.diffList;
                diffImageList.forEach(diffImage => {
                  let isFind = false;
                  if (diffList) {
                    for (const diff of diffList) {
                      if (
                        diff &&
                        diff.imageKey &&
                        diff.imageKey.replace(":R", "") ===
                          diffImage.key.replace(":R", "")
                      ) {
                        isFind = true;
                        break;
                      }
                    }
                  }
                  if (!isFind) {
                    const argObj = DiffComponent.getArg(diffImage);
                    this.addDiff(
                      diffImage.key,
                      imageTag,
                      argObj.type,
                      isReverse ? argObj.reverseX : argObj.x,
                      isReverse ? argObj.reverseY : argObj.y,
                      argObj.from,
                      argObj.to
                    );
                  }
                });
              }
            }
          },
          logOff: true
        })
      )
      .then(() => {
        this.windowOpen("private.display.imageSelectorWindow");
      });
  }

  onBaseResize(size: any) {
    this.baseSize = size;
  }

  get standImageStyle(): any {
    const canvasSize: any = this.baseSize;
    if (canvasSize.w === 0 || canvasSize.h === 0) return {};

    const ratioW: number = 192 / canvasSize.w;
    const ratioH: number = 256 / canvasSize.h;

    const ratio: number = Math.min(ratioW, ratioH);

    const translate: number[] = [0, 0];
    if (ratioW < ratioH) {
      // 横長の場合は下寄せにする
      translate[1] = 256 - canvasSize.h * ratio;
    } else {
      // 縦長の場合は左寄せでいいので何もしない
    }
    const transformList: string[] = [];
    transformList.push(`translate(${translate[0]}px, ${translate[1]}px)`);
    transformList.push(`scale(${ratio}, ${ratio})`);
    return {
      transform: transformList.join(" "),
      transformOrigin: "left top"
    };
  }

  private addDiff(
    image: string = "",
    tag: string = "imgTag-4",
    type: number = 0,
    x: number = 0,
    y: number = 0,
    from: number = 30,
    to: number = 70
  ): void {
    this.addStandImageDiff({
      key: this.actorKey,
      statusName: this.statusName,
      image,
      tag,
      x,
      y,
      type: type,
      time: [from, to]
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
  padding: 0.5em;
  position: relative;
}

.base {
  display: flex;
  flex-direction: column;
  padding: 0 0.5em 0.5em;

  > label {
    display: flex;
    align-items: center;
  }

  > div:not(.img-container) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  button {
    margin-left: 0;
  }

  input[type="range"] {
    margin: 0;
    padding: 0;
    flex: 1;
  }

  input[type="number"] {
    width: 2.5em;
  }

  /*
  */
  $color1: #f7f7f7;
  $color2: #bebebe;
  .stand-image {
    margin-bottom: 0.5em;
    border: 1px solid #666666;
    background: $color1;
    background-image: linear-gradient(45deg, $color2 25%, transparent 0),
      linear-gradient(45deg, transparent 75%, $color2 0),
      linear-gradient(45deg, $color2 25%, transparent 0),
      linear-gradient(45deg, transparent 75%, $color2 0);
    background-size: 16px 16px;
    background-position: 0 0, 8px 8px, 8px 8px, 16px 16px;

    .img {
      background-size: contain;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.delete-button {
  border-radius: 3px;
  border: solid 1px #666666;
  color: #666666;
  position: absolute;
  right: 2px;
  top: 2px;
  padding: 0 1px;
  font-size: 8px;

  &:hover {
    color: darkred;
    border-color: darkred;
  }
}
.tab-contents {
  display: flex;
  flex-direction: row;
  height: 100%;
  background-color: white;
  margin: 0 0.5em 0.5em 1em;
  border: 1px dotted #666666;
  position: relative;

  .disable-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;

    span {
      background-color: white;
      border: solid 2px black;
      border-radius: 5px;
      padding: 1em 0.5em;
    }
  }

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
