<script>
import Floor from '@/components/Floor.vue';
import SetupForm from './components/SetupForm.vue';
export default {
  components: {
    Floor,
    SetupForm,
  },
  data() {
    return {
      floors: 5,
      shafts: 1,
      liftCallStack: [],
      floorButtonActive: [],
      liftOnFloor: [1],
      liftPosition: [
        {
          transition: 'all 3s linear 0s',
          transform: 'translateY(0px)',
        },
      ],
      isLiftDirectionUp: [true],
      isLiftFree: [true],
      isLiftRest: [false],
      setupFloors: 5,
      setupShafts: 1,
      setupError: null,
    };
  },
  methods: {
    callLift(floor) {
      if (this.liftOnFloor.indexOf(floor) === -1) {
        this.liftCallStack.push(floor);
        localStorage.setItem('liftCallStack', this.liftCallStack);
        this.floorButtonActive.push(floor);
        if (this.findClosestFreeLift(floor) != -1) {
          this.moveLiftToFloor(floor, this.findClosestFreeLift(floor));
        }
      }
    },
    findClosestFreeLift(floor) {
      let floorDif;
      let index = -1;
      for (let i = 0; i < this.isLiftFree.length; i++) {
        if (this.isLiftFree[i]) {
          if (Math.abs(this.liftOnFloor[i] - floor) === 1) {
            return i;
          } else if (floorDif > Math.abs(this.liftOnFloor[i] - floor) || floorDif === undefined) {
            floorDif = Math.abs(this.liftOnFloor[i] - floor);
            index = i;
          }
        }
      }
      return index;
    },
    moveLiftToFloor(floor, lift) {
      this.isLiftFree[lift] = false;
      this.liftCallStack.shift();
      localStorage.setItem('liftCallStack', this.liftCallStack);
      this.liftOnFloor[lift] < floor ? (this.isLiftDirectionUp[lift] = true) : (this.isLiftDirectionUp[lift] = false);
      let floorDifference = Math.abs(this.liftOnFloor[lift] - floor);
      this.liftPosition[lift] = {
        transition: `all ${floorDifference * 1}s linear 0s`,
        transform: `translateY(${100 - floor * 100}px)`,
      };
      this.liftOnFloor[lift] = floor;
      localStorage.setItem('floors', this.floors);
      localStorage.setItem('liftOnFloor', this.liftOnFloor);
      setTimeout(() => {
        this.liftRest(lift);
        this.floorButtonActive.shift();
      }, floorDifference * 1000);
    },
    liftRest(lift) {
      this.isLiftRest[lift] = true;
      setTimeout(() => {
        this.isLiftRest[lift] = false;
        this.isLiftFree[lift] = true;
      }, 3000);
    },
    setLiftPosition(){
      for (let i = 0; i < this.liftOnFloor.length; i++) {
        this.liftPosition[i] = {
          transition: `all 3s linear 0s`,
          transform: `translateY(${100 - this.liftOnFloor[i] * 100}px)`,
        };
      }
    },
    getPreviousState() {
      (this.floors = Number(localStorage.getItem('floors'))), (this.shafts = Number(localStorage.getItem('shafts')));
      this.updateModel();
      (this.liftOnFloor = localStorage
        .getItem('liftOnFloor')
        .split(',')
        .map((value) => Number(value))),
        (this.liftCallStack = localStorage.getItem('liftCallStack').split(','));      
      this.setLiftPosition();

      if (this.liftCallStack[0] === '') {
        this.liftCallStack.shift();
      }
      if (this.liftCallStack[0]) {
        this.moveLiftToFloor(this.liftCallStack[0], this.findClosestFreeLift(this.liftCallStack[0]));
      }
    },
    makeSetup(setupFloors, setupShafts, setupError) {
      this.setupError = setupError;
      this.shafts = setupShafts;
      this.floors = setupFloors;
      this.liftOnFloor = this.liftOnFloor.map((onFloor) => {
        this
        return onFloor > this.floors ? 1 : onFloor;
      });
      this.setLiftPosition();

      this.updateModel();
    },

    updateModel() {
      if (this.shafts > this.liftOnFloor.length) {
        for (this.liftOnFloor.length; this.liftOnFloor.length < this.shafts; ) {
          this.liftOnFloor.push(1);
          this.liftPosition.push({
            transition: 'all 3s linear 0s',
            transform: 'translateY(0px)',
          });
          this.isLiftDirectionUp.push(true);
          this.isLiftFree.push(true);
          this.isLiftRest.push(false);
        }
      } else if (this.shafts < this.liftOnFloor.length) {
        this.liftOnFloor.splice(this.shafts, 12);
        this.liftPosition.splice(this.shafts, 12);
        this.isLiftDirectionUp.splice(this.shafts, 12);
        this.isLiftFree.splice(this.shafts, 12);
        this.isLiftRest.splice(this.shafts, 12);
      }
    },
  },
  mounted() {
    if (localStorage.getItem('floors')) {
      this.getPreviousState();
    }
    this.updateModel();
  },
  watch: { 
    isLiftFree: {
      handler: function (newValue) {
        if (newValue.indexOf(true) != -1 && this.liftCallStack.length > 0) {
          this.moveLiftToFloor(this.liftCallStack[0], newValue.indexOf(true));
        }
      },
      deep: true,
    },
    floors(newValue) {
      localStorage.setItem('floors', newValue);
    },
    shafts(newValue) {
      localStorage.setItem('shafts', newValue);
    },
  },
};
</script>

<template>
  <section class="section__lift">
    <div class="lift__shaft" v-for="shaft in shafts">
      <div class="lift" :class="{ lift__blink: isLiftRest[shaft - 1] }" :style="liftPosition[shaft - 1]">
        <p class="lift__direction" v-show="!this.isLiftFree[shaft - 1]">
          {{ `${this.liftOnFloor[shaft - 1]}  ${this.isLiftDirectionUp[shaft - 1] ? '↑' : '↓'}` }}
        </p>
      </div>
    </div>
    <div class="container">
      <floor :floors="floors" :floorButtonActive="floorButtonActive" :callLift="this.callLift" />
      <SetupForm
        :floors="floors"
        :setupFloors="setupFloors"
        :setupShafts="setupShafts"
        :setupError="setupError"
        :shafts="shafts"
        @setup="makeSetup"
      />
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
  padding-left: 15px;
  width: 100vw;
  background-color: rgb(231, 231, 231);
  position: relative;
  display: flex;
  flex-direction: row;
}

.container {
  display: flex;
  flex-direction: column-reverse;
}

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
