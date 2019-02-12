<template>
  <div>
    <label class="switch">
      <input type="checkbox" id="togBtn">
      <div class="slider round">
        <span class="on">BLACK</span>
        <span class="off">WHITE</span>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  computed: {
    player () {
      return this.$store.state.playerColor
    }
  },
  methods: {
    switchPlayer: function () {
      this.$store.commit('switchPlayerColor')
    }
  }
}
</script>

<style lang="scss">

.switch {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 34px;
}

.switch input {
  display:none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #8A8785;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider:before {
  background-color: black;
}

input:checked + .slider:before {
  -webkit-transform: translateX(65px);
  -ms-transform: translateX(65px);
  transform: translateX(65px);
}

.on {
  display: none;
  color: black;
}

.off {
  color: white;
}

.on, .off {
  position: absolute;
  transform: translate(-50%,-50%);
  top: 50%;
  left: 50%;
  font-size: 10px;
  font-family: Verdana, sans-serif;

  // make text unselectable
  -webkit-user-select: none; /* Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

input:checked + .slider .on {
  display: block;
}

input:checked + .slider .off {
  display: none;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>
