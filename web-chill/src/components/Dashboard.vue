<template>
  <div id="dashboard">
    <toggle-button class="toggle-button" @change="togglePlayer"
                  :sync="true"
                  :value="isWhite"
                  :color="{checked:'#8A8785', unchecked:'#8A8785'}"
                  :switchColor="{checked:'white', unchecked:'black'}"
                  :labels="{checked:'playing as white', unchecked:'playing as black'}"
                  :fontSize="13"
                  :width="135"
                  :height="25"
                  :speed="400"/>
    <toggle-button class="toggle-button" @change="toggleShowAvailableMoves"
                  :sync="true"
                  :value="this.$store.state.showAvailableMoves"
                  :color="{checked:'#8A8785', unchecked:'#8A8785'}"
                  :switchColor="{checked:'white', unchecked:'black'}"
                  :labels="{checked:'showing possible moves', unchecked:'hiding possible moves'}"
                  :fontSize="13"
                  :width="185"
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
    isWhite () {
      return this.$store.state.playerColor === 'white'
    }
  },
  methods: {
    chessReset: function () {
      this.$store.dispatch('setChessboard')
    },
    togglePlayer: function () {
      this.$store.commit('togglePlayerColor')
    },
    toggleShowAvailableMoves: function () {
      this.$store.commit('toggleShowAvailableMoves')
    }
  }
}
</script>

<style lang="scss">

#dashboard {
  margin-bottom: 2.5vmin;
}

.toggle-button {
  margin: 1.5vmin;
}

#md-button {
  margin: 1.5vmin;
  height: 25px;
  width: 115px;
  color: white;
  background-color: #5B83A9;
}

</style>
