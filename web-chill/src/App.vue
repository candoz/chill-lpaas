<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      generalPolling: null,
      chessboardPolling: null,
      serverUrl: 'http://' + window.location.host
    }
  },
  methods: {
    pollData () {
      this.generalPolling = setInterval(() => {
        this.$store.dispatch('pollResult', this.serverUrl + '/result')
        this.$store.dispatch('pollTurn', this.serverUrl + '/turn')
        this.$store.dispatch('pollLastMoved', this.serverUrl + '/lastmoved')
        // this.$store.dispatch('generalPoll')
      }, 100)
      this.chessboardPolling = setInterval(() => {
        this.$store.dispatch('pollChessboard', this.serverUrl + '/chessboard')
      }, 50)
    }
  },
  beforeDestroy () {
    clearInterval(this.chessboardPolling)
    clearInterval(this.generalPolling)
  },
  created () {
    setTimeout(this.pollData(), 5000)
  }
}
</script>

<style lang="scss">

body {
  margin: 0;
  height: 100vh;
  width: 100vw;
  background-color: #413E3B;
  color: #8A8785;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding: 2.5vmin;
}

</style>
