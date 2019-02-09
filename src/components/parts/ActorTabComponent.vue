<template>
  <div class="actor-tab-container">

    <!-- タブ -->
    <div class="tabs">
      <label
        class="tab"
        v-for="(actor, index) in standActorList"
        :key="actor.key"
        @click="selectTab(actor.key)"
        :class="{active: activeTabIndex === index}"
      >{{getViewName(actor.key)}}
        <span class="icon-cross" @click.stop="delTab(actor.key)"></span>
      </label>
      <label class="tab">
        <ActorSelect :selectedActorList="standActorList" v-model="selectActorKey"></ActorSelect>
      </label>
    </div>

    <!-- 内容 -->
    <div class="contents">
      <slot :actor="actor"></slot>
    </div>

  </div>
</template>

<script lang="ts">
import ActorSelect from "@/components/parts/select/ActorSelect.vue";
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component<ActorTabComponent>({
  name: "actorTabComponent",
  components: {
    ActorSelect
  }
})
export default class ActorTabComponent extends Vue {
  @Getter("getPeerActors") getPeerActors: any;
  @Getter("getViewName") getViewName: any;
  @Getter("getObj") getObj: any;

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
      this.standActorList.push(actor);
      this.activeTabIndex = this.standActorList.length - 1;
      setTimeout(() => (this.selectActorKey = ""), 0);
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
.actor-tab-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  display: flex;
  flex-direction: column;
}
.tabs {
  display: inline-flex;
  flex-direction: row;
  margin-bottom: -1px;
  box-sizing: border-box;
  z-index: 0;

  label.tab {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #777;
    border-radius: 5px 5px 0 0;
    padding: 0.2em 0.5em 0;

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
      background-color: white;
      border-bottom-color: transparent;
    }
  }
}
.contents {
  background-color: white;
  border: 1px solid #777;
  height: 100px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
