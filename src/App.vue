<script>
import Floor from '@/components/floor.vue';
export default {
  components: {
    Floor,
  },
  data() {
    return {
      floors: 5,
      shafts:1,
      liftCallStack: [],
      liftOnFloor:1,
      liftPosition:{
        transition: "all 3s linear 0s",
        transform: "translateY(0px)",}
    };
  },
  methods: {
    callLift() {},
    moveLiftToFloor(floor){  
      this.liftPosition={
        transition: `all ${Math.abs(this.liftOnFloor - floor)*1}s linear 0s`,
        transform: `translateY(${100-floor*100}px)`,
      }
      this.liftOnFloor=floor;
    }
  },
};
</script>

<template>  
    <section class="section__lift">
      <div class="floor" v-for="floor in floors">
        <div class="lift__shaft" v-for="shaft in shafts"></div>
        <button
          class="lift__btn"
          @click="moveLiftToFloor(floor)"
        >
          {{ floor }}
        </button>
      </div>
      <div class="lift" v-for="shaft in shafts" :style='liftPosition'></div>
    </section>  
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.section__lift {
  margin:auto 0;
  width: 100vw;  
  background-color: rgb(231, 231, 231);
  position: relative;
  display: flex;
  flex-direction: column-reverse;
}
.floor {
  display: flex;
  flex-direction: row;
  margin-left: 15px;
  width: calc(100%-15px);
  min-height: 100px;
  border-bottom: 1px solid gray;
}
.lift__shaft {
  width: 100px;
  height: 98px;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
}
.lift__shaft_full {
  background-color: lightblue;
}
.lift__btn {
  margin: auto 0 auto 15px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 1px black;
  width: 20px;
  height: 20px;
}
.lift {
  position: absolute;
  left: 15px;
  bottom: 0px;
  background-color: lightblue;
  width: 100px;
  height: 100px;  
}
</style>
