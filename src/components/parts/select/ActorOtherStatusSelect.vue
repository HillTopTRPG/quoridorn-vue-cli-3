<template>
  <select-base defaultLabel="個別設定" :defaultSelectable="true" v-model="localValue">
    <option :key="status.name" :value="status.name" v-for="status in useStatusList">{{status.name}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

import { Prop } from "vue-property-decorator";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: { SelectBase }
})
export default class ActorOtherStatusSelect extends Mixins<SelectMixin>(
  SelectMixin
) {
  @Prop({ type: Object, required: true })
  private actor!: any;

  @Prop({ type: String, required: true })
  private statusName!: any;

  get useStatusList(): any[] {
    return this.actor.statusList.filter(
      (status: any) => !status.standImage.ref && status.name !== this.statusName
    );
  }
}
</script>
