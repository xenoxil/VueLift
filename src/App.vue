<script>
import Floor from '@/components/floor.vue';
export default {
  components: {
    Floor,
  },
  data() {
    return {
      floors: 5,
      shafts: 3,
      liftCallStack: [],
      liftOnFloor: 1,
      liftPosition: {
        transition: 'all 3s linear 0s',
        transform: 'translateY(0px)',
      },
      isLiftDirectionUp: true,
      isLiftFree: true,
      isLiftRest: false,
    };
  },
  methods: {
    callLift(floor) {
      if (this.liftOnFloor !== floor) {
        this.liftCallStack.push(floor);
        localStorage.setItem('liftCallStack', this.liftCallStack);
        if (this.isLiftFree) {
          this.moveLiftToFloor(floor);
        }
      }
    },
    moveLiftToFloor(floor) {
      this.isLiftFree = false;
      this.liftOnFloor < floor ? (this.isLiftDirectionUp = true) : (this.isLiftDirectionUp = false);
      let floorDifference = Math.abs(this.liftOnFloor - floor);
      this.liftPosition = {
        transition: `all ${floorDifference * 1}s linear 0s`,
        transform: `translateY(${100 - floor * 100}px)`,
      };
      this.liftOnFloor = floor;
      localStorage.setItem('floors', this.floors);
      localStorage.setItem('liftOnFloor', this.liftOnFloor);
      setTimeout(() => {
        this.liftRest();
        this.liftCallStack.shift();
        localStorage.setItem('liftCallStack', this.liftCallStack);
      }, floorDifference * 1000);
    },
    liftRest() {
      this.isLiftRest = true;
      setTimeout(() => {
        this.isLiftRest = false;
        this.isLiftFree = true;
      }, 3000);
    },
    getPreviousState() {
      (this.floors = Number(localStorage.getItem('floors'))),
        (this.liftOnFloor = Number(localStorage.getItem('liftOnFloor'))),
        (this.liftCallStack = localStorage.getItem('liftCallStack').split(',')),
        (this.liftPosition = {
          transition: `all 3s linear 0s`,
          transform: `translateY(${100 - this.liftOnFloor * 100}px)`,
        });
      if (this.liftCallStack[0] != '') {
        console.log(this.liftCallStack);
        this.moveLiftToFloor(this.liftCallStack[0]);
      }
    },
  },
  mounted() {
    if (localStorage.getItem('floors')) {
      this.getPreviousState();
    }
  },
  watch: {
    isLiftRest(newValue) {
      !newValue && this.liftCallStack.length > 0 ? this.moveLiftToFloor(this.liftCallStack[0]) : null;
    },
  },
};
</script>

<template>
  <section class="section__lift">
    <div class="floor" v-for="floor in floors">
      <div class="lift__shaft" v-for="shaft in shafts">
        <div class="lift" :class="{ lift__blink: isLiftRest }" v-for="shaft in shafts" :style="liftPosition">
          <p class="lift__direction" v-show="!this.isLiftFree">
            {{ `${this.liftOnFloor}  ${isLiftDirectionUp ? '↑' : '↓'}` }}
          </p>
        </div>
      </div>
      <button
        class="lift__btn"
        :class="{ lift__btn_active: this.liftCallStack.find((element) => element === floor) }"
        @click="callLift(floor)"
      >
        {{ floor }}
      </button>
    </div>
  </section>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.section__lift {
  margin: auto 0;
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
  margin-left: 10px;
  width: 100px;
  height: 98px;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
}
.lift__shaft:first-of-type {
  margin-left: 0;
}
.lift__shaft_full {
  background-color: lightblue;
}
.lift__btn {
  margin: auto 0 auto 15px;
  border-radius: 10px;
  background-color: white;
  width: 20px;
  height: 20px;
}
.lift__btn_active {
  background-color: orange;
}
.lift {
  position: absolute;
  left: 15px;
  bottom: 0px;
  background-color: lightblue;
  width: 100px;
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
