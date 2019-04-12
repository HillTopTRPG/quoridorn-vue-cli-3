<template>
  <select-base :defaultLabel="defaultLabel" v-model="localValue">
    <option :key="actor.key" :value="actor.key" v-for="actor in selectActors">{{actor.name}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

import { Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: { SelectBase }
})
export default class ActorSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("getPeerActors") private getPeerActors: any;

  @Prop({ type: String, default: "アクター" })
  protected defaultLabel!: string;

  @Prop({ type: Array, required: true })
  private selectedActorList!: any[];

  get selectActors(): any[] {
    return this.getPeerActors.filter(
      (actor: any) =>
        this.selectedActorList.findIndex(
          standActor => standActor.key === actor.key
        ) === -1
    );
  }
}
</script>
