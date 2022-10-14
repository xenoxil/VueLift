<template>
  <div class="floor">
    <div class="lift__shaft"></div>
    <div class="floor__container">
      <p class="floor__number">{{ floor.id }}</p>
      <button class="lift__btn">liftButton</button>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        floor:{
            type:Object,
            required:true,
        }
    }
};
</script>

<style scoped>

</style>
