<script setup>

</script>

<template>
<section class="section__lift"> 
  <div class="floor">
    <div class="lift__shaft"></div>
    <button class="lift__btn"></button>
  </div>
  
</section>
</template>

<style >
*{margin:0;
padding: 0;
box-sizing: border-box;}
.section__lift{
  width: 100vw;
  height:100vh;
background-color: rgb(231, 231, 231);
}
.floor{
  width:100px;
  min-height: 100px;
}
.lift__shaft{
  margin-left:15px;
  width:100%;
  min-height: 100%;
  border-left:  1px solid gray;
  border-right:  1px solid gray;
}
</style>
