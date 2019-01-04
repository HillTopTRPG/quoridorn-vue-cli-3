<script lang="ts">
import Vue from "vue";
import { Mixin } from "vue-mixin-decorator";
import { Getter } from "vuex-class";

@Mixin
export default class WindowMixin extends Vue {
  @Getter("getWindowParam") getWindowParam: any;

  windowParam(instance: any): any {
    const className = this.constructor.name;
    const propName = className.charAt(0).toLowerCase() + className.substring(1);
    return this.getWindowParam(propName);
  }
}
</script>
