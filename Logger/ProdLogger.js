const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, errors, json } = format;
 

function ProdLogger(){

    return logger = winston.createLogger({
 
        format: combine(
 
          timestamp(),
          errors({stack:true}),
          json()
        ),
      
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' }),
        //   new winston.transports.Console()
        ],
      });
       
     
      
}


module.exports=ProdLogger;