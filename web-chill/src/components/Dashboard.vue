<template>
  <div id="dashboard">
    <toggle-button id="toggle-button" @change="switchPlayer"
                  :sync="true"
                  :value="isBlack"
                  :color="{checked:'#8A8785', unchecked:'#8A8785'}"
                  :switchColor="{checked:'black', unchecked:'white'}"
                  :labels="{checked:'playing as black', unchecked:'playing as white'}"
                  :fontSize="12"
                  :width="125"
                  :height="25"
                  :speed="400"/>
    <md-button id="md-button" class="md-raised md-primary" @click="chessReset">reset board</md-button>
  </div>
</template>

<script>
import { ToggleButton } from 'vue-js-toggle-button'

export default {
  data () {
    return {}
  },
  components: {
    ToggleButton
  },
  computed: {
    isBlack () {
      return this.$store.state.playerColor === 'black'
    }
  },
  methods: {
    chessReset: function () {
      this.$store.dispatch('setChessboard', 'http://localhost:5000/chessboard')
    },
    switchPlayer: function () {
      this.$store.commit('switchPlayerColor')
    }
  }
}
</script>

<style lang="scss">

#dashboard {
  margin-bottom: 2.5vmin;
}

#toggle-button {
  margin-right: 1.5vmin;
}

#md-button {
  height: 25px;
  width: 125px;
  margin: 0px;
  color: white;
  background-color: #5B83A9;
}

</style>
