<template>
  <div class="actor-tab-container">

    <!-- タブ -->
    <div class="actor-tabs" @contextmenu.prevent>
      <label class="tab">
        <self-actor-select :selectedActorList="standActorList" v-model="selectActorKey"/>
      </label>
      <label
        class="tab"
        v-for="(actor, index) in standActorList"
        :key="actor.key"
        @click="selectTab(actor.key)"
        :class="{active: activeTabIndex === index}"
      >{{getViewName(actor.key)}}
        <span class="icon-cross" @click.stop="delTab(actor.key)"></span>
      </label>
    </div>

    <!-- 内容 -->
    <div class="actor-contents">
      <slot :actor="actor"></slot>
    </div>

  </div>
</template>

<script lang="ts">
import SelfActorSelect from "@/components/parts/select/SelfActorSelect.vue";
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({
  components: {
    SelfActorSelect
  }
})
export default class ActorTabComponent extends Vue {
  @Getter("getSelfActors") private getSelfActors: any;
  @Getter("getViewName") private getViewName: any;
  @Getter("getObj") private getObj: any;

  private standActorList: any[] = [];
  private activeTabIndex: number = -1;
  private selectActorKey: string = "";

  selectTab(actorKey: string) {
    this.activeTabIndex = this.standActorList.findIndex(
      actor => actor.key === actorKey
    );
  }

  delTab(actorKey: string) {
    const index = this.standActorList.findIndex(
      actor => actor.key === actorKey
    );
    this.activeTabIndex--;
    if (this.activeTabIndex < 0) this.activeTabIndex = 0;
    this.standActorList.splice(index, 1);
  }

  @Emit("change")
  public change(value: string) {}

  @Watch("activeTabIndex")
  onChangeActiveTabIndex(value: number) {
    const actor: any = this.actor;
    this.change(actor ? actor.key : null);
  }

  @Watch("selectActorKey")
  onChangeSelectActorKey(selectActorKey: string) {
    if (selectActorKey) {
      const actor = this.getObj(selectActorKey);
      this.standActorList.unshift(actor);
      this.activeTabIndex++;
      setTimeout(() => {
        this.selectActorKey = "";
        this.activeTabIndex = 0;
      }, 0);
    }
  }

  get actor(): any {
    if (this.activeTabIndex === -1) return null;
    return this.standActorList[this.activeTabIndex];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$backColor: rgba(230, 255, 230, 1);
.actor-tab-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  display: flex;
  flex-direction: column;
}
.actor-tabs {
  display: inline-flex;
  flex-direction: row;
  margin-bottom: -1px;
  box-sizing: border-box;
  z-index: 0;

  label.tab {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #777777;
    border-radius: 5px 5px 0 0;
    padding: 0.2em 0.5em 0;
    background-color: #cccccc;
    margin-top: 0.5em;

    span[class^="icon-"] {
      visibility: hidden;
      margin-left: 0.2em;
    }
    &:first-child {
      margin-left: 1em;
    }
    &:not(:first-child) {
      margin-left: -1px;
    }
    &:hover span[class^="icon-"] {
      visibility: visible;
    }
    &.active {
      background-color: $backColor;
      border-bottom-color: transparent;
      margin-top: 0;
    }
  }
}
.actor-contents {
  background-color: $backColor;
  border: 1px solid #777777;
  height: 100px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
