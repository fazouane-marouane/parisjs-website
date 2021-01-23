const algolia = require('algoliasearch')

const loadEnv = require('../lib/loadEnv')
const { getAllMeetups } = require('../lib/meetups')

indexMeetups()
  .then(() => {
    console.log('END.')
    process.exit(0)
  })
  .catch(function (e) {
    console.error(e)
    process.exit(1)
  })

async function indexMeetups() {
  loadEnv()
  const credentials = getCredentials()
  const records = await getAllMeetups()
  records.sort((a, b) => a.dateUnix - b.dateUnix)

  await uploadDataWithClear(credentials, 'paris.js-meetups', records)
}

function getCredentials() {
  if (!process.env.ALGOLIA_APPLICATION_ID)
    throw new Error('ALGOLIA_APPLICATION_ID must be defined')
  if (!process.env.ALGOLIA_ADMIN_KEY)
    throw new Error('ALGOLIA_ADMIN_KEY must be defined')

  const {
    ALGOLIA_APPLICATION_ID: appID,
    ALGOLIA_ADMIN_KEY: apiKey,
  } = process.env
  return { appID, apiKey }
}

async function uploadDataWithClear({ appID, apiKey }, indexName, toUpload) {
  const client = algolia(appID, apiKey)
  const index = client.initIndex(indexName)
  console.log('clearing index')
  await index.clearObjects()
  console.log('Sending to Algolia - ' + toUpload.length + ' records')
  await index.saveObjects(toUpload)
}
