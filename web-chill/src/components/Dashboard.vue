<template>
  <div id="dashboard">
    <toggle-button id="toggle-button" @change="switchPlayer"
                  :sync="player"
                  :color="{checked:'#8A8785', unchecked:'#8A8785'}"
                  :switchColor="{checked:'black', unchecked:'white'}"
                  :labels="{checked:'playing as black', unchecked:'playing as white'}"
                  :fontSize="12"
                  :width="130"
                  :height="25"
                  :speed="400"/>
    <button v-on:click="chessReset">reset board</button>
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
    player () {
      return this.$store.state.playerColor
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

</style>
