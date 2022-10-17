<template>
  <div>
    <p class="setup__error">{{ $store.state.setupError }}</p>
    <form class="setup" @submit.prevent>
      <p class="setup__text">Кол-во этажей</p>
      <input class="setup__input" type="number" v-model="$store.state.setupFloors" />
      <p class="setup__text">Кол-во лифтов</p>
      <input class="setup__input" type="number" v-model="$store.state.setupShafts" />
      <button class="setup__submitBtn" type="submit" 
      @click="$store.commit('makeSetup')">Submit</button>
    </form>
  </div>
</template>

<script>
export default { 
};
</script>

<style scoped>
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
.setup__error {
  color: rgb(241, 0, 0);
  margin: 10px 0 0 15px;
}
</style>
