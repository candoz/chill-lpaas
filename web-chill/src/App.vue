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
      chessboardPolling: null
    }
  },
  methods: {
    pollData () {
      this.generalPolling = setInterval(() => {
        this.$store.dispatch('pollResult', 'http://localhost:5000/result')
        this.$store.dispatch('pollTurn', 'http://localhost:5000/turn')
        this.$store.dispatch('pollLastMoved', 'http://localhost:5000/lastmoved')
        // this.$store.dispatch('generalPoll')
      }, 400)
      this.chessboardPolling = setInterval(() => {
        this.$store.dispatch('pollChessboard', 'http://localhost:5000/chessboard')
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
