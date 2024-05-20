//<==================IMPORTS===================>
import './index.css'
import { loadTimezones } from '../controllers/loadTimezones.js'

//<===============STARTUP LOGIC================>
//load up current time and timezones, set update interval
loadTimezones()
setInterval(loadTimezones, 1000)
