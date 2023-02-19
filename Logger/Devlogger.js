const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, errors, printf } = format;
 
const logFormat = printf(({ level, message, timestamp ,stack}) => {
  return `${timestamp}  ${level}: ${stack || message}`;
});

function DevLogger(){

    return logger = winston.createLogger({
 
        format: combine(
          format.colorize(),
          timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
          errors({stack:true}),
          logFormat
        ),
      
        transports: [
          
          new winston.transports.Console()
        ],
      });
       
     
      
}


module.exports=DevLogger;