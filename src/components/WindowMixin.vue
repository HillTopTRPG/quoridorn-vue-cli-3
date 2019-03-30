<script lang="ts">
import Vue from "vue";
import { Mixin } from "vue-mixin-decorator";

interface COUNTER_REMOCON_TYPE_INTERFACE {
  PLUS: number;
  MINUS: number;
  EQUALS: number;
  PLUS_MINUS: number;
}

const COUNTER_REMOCON_TYPE_DATA: any = {
  PLUS: 1,
  MINUS: -1,
  EQUALS: 0,
  PLUS_MINUS: 2
};

@Mixin
export default class WindowMixin extends Vue {
  COUNTER_REMOCON_TYPE: COUNTER_REMOCON_TYPE_INTERFACE = COUNTER_REMOCON_TYPE_DATA;
}
</script>
