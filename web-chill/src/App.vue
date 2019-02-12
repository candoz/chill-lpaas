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
      polling: null
    }
  },
  methods: {
    pollData () {
      this.polling = setInterval(() => {
        this.$store.dispatch('pollResult', 'http://localhost:5000/result')
        this.$store.dispatch('pollChessboard', 'http://localhost:5000/chessboard')
        this.$store.dispatch('pollTurn', 'http://localhost:5000/turn')
        // this.$store.dispatch('generalPoll')
      }, 100)
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding: 2.5vmin;
}

</style>
