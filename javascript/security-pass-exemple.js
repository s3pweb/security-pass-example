const axios = require('axios').default
const log = require('npmlog')
const dayjs = require('dayjs')

log.level = 'info'

let accessesAndDates = new Map()

async function run () {
  const instance = axios.create({
    // TODO set API url
    baseURL: '',
    timeout: 60000,
    headers: {
      Accept: 'application/json',
      // TODO set token
      Token: ''
    }
  })

  let accessesTs = dayjs(0)

  while (true) {
    // Reload accesses every hour
    if (dayjs().diff(accessesTs, 'minutes', true) > 3) {
      await getCurrentAccesses(instance)
      accessesTs = dayjs()
    }

    await getEventsForAccesses(instance)

    await sleep()
  }
}

async function getCurrentAccesses (instance) {
  log.info(new Date().toISOString(), 'Calling getCurrentAccesses')
  // Get all current accesses
  const currentAccesses = await instance.get('/customers/v2/api/accesses?current=true')
  log.verbose(new Date().toISOString(), `Got ${currentAccesses.data.length} access requests.`)

  const newAccessesAndDates = new Map()

  for (const access of currentAccesses.data) {
    const existingAccess = accessesAndDates.get(access.orderId)
    // Create new access and dates
    newAccessesAndDates.set(access.orderId, {
      orderId: access.orderId,
      from: existingAccess ? existingAccess.from : new Date(access.loadingTsMin),
      to: dayjs().add(1, 'hour').toDate()
    })
  }

  accessesAndDates = newAccessesAndDates
}

async function getEventsForAccesses (instance) {
  log.info(new Date().toISOString(), 'Calling getEventsForAccesses')
  let eventsCount = 0

  const currentAccesses = Array.from(accessesAndDates.values())

  const bodies = []
  bodies[0] = []
  let i = 0
  let arrayIndex = 0
  for (const aad of currentAccesses) {
    bodies[arrayIndex].push(aad)
    i++
    if (i >= 50) {
      arrayIndex++
      bodies[arrayIndex] = []
      i = 0
    }
  }

  let index = 0
  for (const body of bodies) {
    eventsCount += await getEventsFromArray(instance, body, index)
    index++
  }

  log.info(new Date().toISOString(), `Total - Got ${eventsCount} events.`)
}

async function getEventsFromArray (instance, body, index) {
  let count = 0
  try {
    // Get events for all accesses
    const results = await instance.post('/customers/v2/api/events', body)

    for (const eventsForAccess of results.data) {
      if (eventsForAccess.events.length > 0) {
        count = eventsForAccess.events.length
        await processEvents(eventsForAccess)

        const aad = accessesAndDates.get(eventsForAccess.orderId)
        const lastEventTs = new Date(eventsForAccess.events[eventsForAccess.events.length - 1].ts)

        if (aad && aad.from.getTime() < lastEventTs.getTime()) {
          // Update the "from" Date to the last event TS + 1 second
          log.verbose(new Date().toISOString(), `Request ${index} - Previous from: ${aad.from.toISOString()} New from ${lastEventTs.toISOString()}`)
          aad.from = dayjs(lastEventTs).add(1, 'second').toDate()
        }
      }
    }
    log.verbose(new Date().toISOString(), `Request ${index} - Got ${count} events.`)
  } catch (err) {
    log.error(new Date().toISOString(), `Request ${index} - Error`, err.response.data)
  }

  return count
}

async function processEvents (eventsForAccess) {
  log.verbose(new Date().toISOString(), `Processing orderId: ${eventsForAccess.orderId} and ${eventsForAccess.events.length} events.`)
}

function sleep () {
  return new Promise((resolve) => {
    setTimeout(resolve, 120000)
  })
}

run().catch(function (error) {
  log.error(error)
})
