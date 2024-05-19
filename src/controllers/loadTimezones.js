const loadTimezones = () => {
  const centralDaylightTime = document.getElementById('central-daylight-time')
  const mountainDaylightTime = document.getElementById('mountain-daylight-time')
  const mountainStandardTime = document.getElementById('mountain-standard-time')
  const easternDaylightTime = document.getElementById('eastern-daylight-time')
  const pacificDaylightTime = document.getElementById('pacific-daylight-time')

  const currentTime = new Date()
  const currentCDTTime = currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Chicago' })
  const currentMDTTime = currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Denver' })
  const currentMSTTIme = currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Phoenix' })
  const currentEDTTime = currentTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' })
  const currentPDTTime = currentTime.toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
  })

  centralDaylightTime.textContent = currentCDTTime
  mountainDaylightTime.textContent = currentMDTTime
  mountainStandardTime.textContent = currentMSTTIme
  easternDaylightTime.textContent = currentEDTTime
  pacificDaylightTime.textContent = currentPDTTime
}

export { loadTimezones }
