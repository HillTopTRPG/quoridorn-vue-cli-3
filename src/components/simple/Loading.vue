<template>
  <div class="loading" v-show="isLoading" @contextmenu.prevent>
    <span>お待ちください</span>
    <span class="icon icon-spinner2"></span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
export default class Loading extends Vue {
  @Getter("isLoading") private isLoading: any;
}
</script>

<style scoped lang="scss">
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  font-size: 0;

  background-color: white;
  z-index: 200000;
  border-radius: 10%;
  border: 3px solid black;

  width: 7rem;
  height: 7rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  padding: 1rem;

  span {
    font-size: 1rem;
    flex: 1;

    &.icon {
      padding: 5px;
      flex: 1;
      font-size: 5rem;
      animation: spin 0.8s linear infinite;
      -webkit-animation: spin 0.8s linear infinite;
    }
  }
}

@keyframes spin {
  from {
    transform: translateY(0) rotate(0deg);
  }
  to {
    transform: translateY(0) rotate(360deg);
  }
  /*
    0% {
      transform: translateY(0) rotate(0deg);
    }
    12.4% {
      transform: translateY(0) rotate(0deg);
    }
    12.5% {
      transform: translateY(0) rotate(45deg);
    }
    24.9% {
      transform: translateY(0) rotate(45deg);
    }
    25% {
      transform: translateY(0) rotate(90deg);
    }
    37.4% {
      transform: translateY(0) rotate(90deg);
    }
    37.5% {
      transform: translateY(0) rotate(135deg);
    }
    49.9% {
      transform: translateY(0) rotate(135deg);
    }
    50% {
      transform: translateY(0) rotate(180deg);
    }
    62.4% {
      transform: translateY(0) rotate(180deg);
    }
    62.5% {
      transform: translateY(0) rotate(225deg);
    }
    74.9% {
      transform: translateY(0) rotate(225deg);
    }
    75% {
      transform: translateY(0) rotate(270deg);
    }
    87.4% {
      transform: translateY(0) rotate(270deg);
    }
    87.5% {
      transform: translateY(0) rotate(315deg);
    }
    100% {
      transform: translateY(0) rotate(315deg);
    }
    */
}

@-webkit-keyframes spin {
  from {
    transform: translateY(0) rotate(0deg);
  }
  to {
    transform: translateY(0) rotate(360deg);
  }
  /*
    0% {
      transform: translateY(0) rotate(0deg);
    }
    12.4% {
      transform: translateY(0) rotate(0deg);
    }
    12.5% {
      transform: translateY(0) rotate(45deg);
    }
    24.9% {
      transform: translateY(0) rotate(45deg);
    }
    25% {
      transform: translateY(0) rotate(90deg);
    }
    37.4% {
      transform: translateY(0) rotate(90deg);
    }
    37.5% {
      transform: translateY(0) rotate(135deg);
    }
    49.9% {
      transform: translateY(0) rotate(135deg);
    }
    50% {
      transform: translateY(0) rotate(180deg);
    }
    62.4% {
      transform: translateY(0) rotate(180deg);
    }
    62.5% {
      transform: translateY(0) rotate(225deg);
    }
    74.9% {
      transform: translateY(0) rotate(225deg);
    }
    75% {
      transform: translateY(0) rotate(270deg);
    }
    87.4% {
      transform: translateY(0) rotate(270deg);
    }
    87.5% {
      transform: translateY(0) rotate(315deg);
    }
    100% {
      transform: translateY(0) rotate(315deg);
    }
    */
}
</style>
