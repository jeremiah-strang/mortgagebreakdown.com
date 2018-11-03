<template>
  <div id="app">
    <div class="app-body-wrap">
      <!-- <router-view></router-view> -->
      <Breakdown></Breakdown>
    </div>
  </div>
</template>

<script>
import Breakdown from '@/components/Breakdown.vue'

export default {
  name: 'app',
  components: {
    Breakdown,
  },
}
</script>

<style lang="scss">
@import 'styles/_shared.scss';

#app {
  @extend .pnl;
  @extend .pad1;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100% - 174px);
}

.app-body-wrap {
  @extend .pnl;
  @extend .hw100;
}
</style>
