<template>
  <div id="app">
    <div class="app-body-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
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
