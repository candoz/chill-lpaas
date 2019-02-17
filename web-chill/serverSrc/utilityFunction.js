module.exports = {

  chessboardMatrixCreator: (side) => {
    let matrix = []
    for (let i = 0; i < side; i++) {
      matrix[i] = []
      for (let j = 0; j < side; j++) {
        matrix[i][j] = undefined
      }
    }
    return matrix
  },

  wrapCoordinate: (coordArray) => {
    return 'point(' + coordArray[0] + ',' + coordArray[1] + ')'
  }

}
