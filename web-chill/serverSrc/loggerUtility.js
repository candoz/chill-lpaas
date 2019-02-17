const winston = require('winston')

module.exports = {
  winstonLogger: winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.Console({ 'colorize': true }),
      new winston.transports.File({ filename: 'logfile.log' })
    ]
  })
}
