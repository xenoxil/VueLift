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
      liftButtonActive: [],
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
      setupShafts: 3,
      setupError: null,
    };
  },
  methods: {
    callLift(floor) {
      if (this.liftOnFloor.indexOf(floor) === -1) {
        this.liftCallStack.push(floor);
        localStorage.setItem('liftCallStack', this.liftCallStack);
        this.liftButtonActive.push(floor);
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
        this.liftButtonActive.shift();
      }, floorDifference * 1000);
    },
    liftRest(lift) {
      this.isLiftRest[lift] = true;
      setTimeout(() => {
        this.isLiftRest[lift] = false;
        this.isLiftFree[lift] = true;
      }, 3000);
    },
    getPreviousState() {
      (this.floors = Number(localStorage.getItem('floors'))), (this.shafts = Number(localStorage.getItem('shafts')));
      this.updateModel();
      (this.liftOnFloor = localStorage
        .getItem('liftOnFloor')
        .split(',')
        .map((value) => Number(value))),
        (this.liftCallStack = localStorage.getItem('liftCallStack').split(','));
      console.log(this.liftCallStack);
      for (let i = 0; i < this.liftOnFloor.length; i++) {
        this.liftPosition[i] = {
          transition: `all 3s linear 0s`,
          transform: `translateY(${100 - this.liftOnFloor[i] * 100}px)`,
        };
      }

      if (this.liftCallStack[0] === '') {
        this.liftCallStack.shift();
      }
      if (this.liftCallStack[0]) {
        this.moveLiftToFloor(this.liftCallStack[0], this.findClosestFreeLift(this.liftCallStack[0]));
      }
    },
    makeSetup() {
      if (1 < this.setupFloors && this.setupFloors <= 99 && 0 < this.setupShafts && this.setupShafts <= 12) {
        this.setupError = null;
        this.shafts = this.setupShafts;
        this.floors = this.setupFloors;
        this.updateModel();
      } else {
        this.setupError = 'Ошибка: требуется 2-99 этажей и 1-12 лифтов ';
      }
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
          console.log(newValue.indexOf(true));
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
    <div class="container" :style="{ width: 100 }">
      <div class="floor" v-for="floor in floors">
        <button
          class="lift__btn"
          :class="{ lift__btn_active: this.liftButtonActive.find((element) => element === floor) }"
          @click="callLift(floor)"
        >
          {{ floor }}
        </button>
      </div>
      <p class="error">{{ setupError }}</p>
      <form class="setup" @submit.prevent>
        <p class="setup__text">Кол-во этажей</p>
        <input
          class="setup__input"
          type="number"
          v-bind:value="floors"
          @input="setupFloors = Number($event.target.value)"
        />
        <p class="setup__text">Кол-во лифтов</p>
        <input
          class="setup__input"
          type="number"
          v-bind:value="shafts"
          @input="setupShafts = Number($event.target.value)"
        />
        <button class="setup__submitBtn" type="submit" @click="makeSetup">Submit</button>
      </form>
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

.setup {
  display: flex;
  flex-direction: row;
  max-height: 30px;
  margin-left: 15px;
  margin-top: 10px;
}
.setup__input {
  margin: 0 5px;
  width: 40px;
}
.setup__submitBtn {
  width: 50px;
  display: flex;
  flex-direction: row;
  border-radius: 3px;
  border: 0;
  justify-content: center;
  align-items: center;
  background-color: rgb(250, 250, 250);
  border: 0.5px solid gray;
}
.error {
  color: rgb(241, 0, 0);
  margin: 10px 0 0 15px;
}
.container {
  display: flex;
  flex-direction: column-reverse;
}
.floor {
  display: flex;
  flex-direction: row;
  margin-left: 15px;
  min-height: 100px;
  border-bottom: 1px solid gray;
}
.lift__shaft {
  margin-left: 10px;
  width: 100px;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  position: relative;
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
  left: 0px;
  bottom: 0px;
  background-color: lightblue;
  width: 97.5px;
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
