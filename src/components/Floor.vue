<template>
  <div class="floor" v-for="floor in floors">
        <button
          class="floor__btn"
          :class="{ floor__btn_active: this.floorButtonActive.find((element) => element === floor) }"
          @click="callLift(floor)"
        >
          {{ floor }}
        </button>
      </div>
</template>

<script>
export default {
    props:{
        floors:{
            type: Number,
            required:true,
        },
        floorButtonActive:{
            type: Array,
            required:true,
        },
        callLift:{          
          required:true,
        }
    }
};
</script>

<style scoped>
.floor {
  display: flex;
  flex-direction: row;
  margin-left: 15px;
  min-height: 100px;
  border-bottom: 1px solid gray;
}
.floor__btn {
  margin: auto 0 auto 15px;
  border-radius: 10px;
  background-color: white;
  width: 20px;
  height: 20px;
}
.floor__btn_active {
  background-color: orange;
}
</style>
