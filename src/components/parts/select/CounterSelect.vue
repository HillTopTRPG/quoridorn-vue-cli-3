<template>
  <select-base defaultLabel="カウンター名" v-model="localValue">
    <option v-for="(property, index) in propertyList" :key="index" :value="property.property">{{property.property}}</option>
  </select-base>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

@Component<CounterSelect>({
  name: "counterSelect",
  mixins: [SelectMixin],
  components: { SelectBase }
})
export default class CounterSelect extends Vue {
  @Getter("propertyList") propertyList: any;
}
</script>
