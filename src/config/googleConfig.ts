const {google} = require('googleapis');
import  * as path from 'path';

const keyPath = path.join(__dirname, '../../build-zone-423300-1126615d4ccc.json');
const jsonData = keyPath;

console.log('jsonData:', jsonData);


const googleConfig = new google.auth.GoogleAuth( {
  keyFile: jsonData,
  scopes: ['https://www.googleapis.com/auth/drive']
});

export default googleConfig;