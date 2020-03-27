
import Zeroconf from 'react-native-zeroconf'

const zeroconf = new Zeroconf()
 


const getIP = () => {
    // Find all local network devices.

    // Get Local IP
// NetworkInfo.getIPAddress().then(ipAddress => {
//   console.log(ipAddress);
// });

zeroconf.scan(type = 'http', protocol = 'tcp', domain = 'local.')
zeroconf.on('start', () => console.log('The scan has started.'))
zeroconf.on('found', (d) => {
    console.log(d, d.slice(0,3))
    if(d.slice(0,3) === "OBS"){
        console.log(d.slice(6).split(' ').join('.'))
        return d.slice(6).split(' ').join('.')
    }
    zeroconf.stop()
})




}


module.exports = getIP