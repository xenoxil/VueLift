<template>
  <div class="lift__shaft" v-for="shaft in $store.state.shafts">
    <div class="lift" :class="{ lift__blink: $store.state.isLiftRest[shaft - 1] }" :style="$store.state.liftPosition[shaft - 1]">
      <p class="lift__direction" v-show="!$store.state.isLiftFree[shaft-1]">
        {{ `${$store.state.liftOnFloor[shaft - 1]}  ${$store.state.isLiftDirectionUp[shaft-1] ? '↑' : '↓'}` }}
      </p>
    </div>
  </div>
</template>

<script>
export default {  
};
</script>

<style scoped>
.lift__shaft {
  margin-left: 10px;
  width: 100px;
  max-width: 100px;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  position: relative;
}
.lift__shaft:first-of-type {
  margin-left: 0;
}

.lift {
  position: absolute;
  left: 0px;
  bottom: 0px;
  background-color: lightblue;
  width: 100%;
  height: 100px;
  display: flex;
}
.lift__direction {
  margin: 10px auto auto;
  background-color: #f6fafa;
}
.lift__blink {
  animation: blink linear 3s;
}

@keyframes blink {
  25% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
}
</style>
