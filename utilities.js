require('dotenv').config();
const { LOG_API_CALL_TIME, LOG_API_CALL_RESULT } = require('./config');
// const { TEST, LOG_TIME } = process.env;

const _ = require('lodash');

const callAPI = async (library, methodPath, ...args) => {
    

      const methodName = methodPath.split('.').pop();
      const method = library[methodName];
    
      if (typeof method !== 'function') throw new Error(`Method ${methodPath} not found`)

      let res, start;
     

        
        if ( LOG_API_CALL_TIME) start = logTime();
       
        try {
            res = await method.call(library, ...args);
        } catch(error) {
            // console.error(error);
            throw new Error(`Error occured while calling ${methodPath}`, { error });
        }
      if (LOG_API_CALL_TIME) logTime(`${methodPath}`, start);
      if (LOG_API_CALL_RESULT) console.log(`${methodPath} result:`, res);
      
        return res;
    }


    const logTime = (label, start) => {
        if (! LOG_API_CALL_TIME) return;
        const NS_PER_SEC = 1e9;
        const NUM_IN_MS = 1000000;
        if (start) {
          const diff = process.hrtime(start);
          const time = (diff[0] ? diff[0] + ' sec, ' : '') + (diff[1]/NUM_IN_MS).toFixed(3) + 'ms';
          return { [label]: time };
        }
        return process.hrtime();
    }

    const delay = (time) => {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }

    const random = (min, max) => {
        return Math.round(Math.random() * (max - min) + min);
    }

    const roughSizeOfObject = (value) => {
        const typeSizes = {
          "undefined": () => 0,
          "boolean": () => 4,
          "number": () => 8,
           "bigint": () => 8,
          "string": item => 2 * item.length,
          "object": item => !item ? 0 : Object
            .keys(item)
            .reduce((total, key) => ut.roughSizeOfObject(key) + ut.roughSizeOfObject(item[key]) + total, 0)
        };
        return typeSizes[typeof value](value)
    }
    
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    const humanFileSize = (bytes, si=false, dp=1) => {
        const thresh = si ? 1000 : 1024;
      
        if (Math.abs(bytes) < thresh) {
          return bytes + ' B';
        }
      
        const units = si 
          ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
          : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;
      
        do {
          bytes /= thresh;
          ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
      
      
        return bytes.toFixed(dp) + ' ' + units[u];
    }





module.exports = {callAPI, logTime, delay, random, roughSizeOfObject, formatBytes, humanFileSize};