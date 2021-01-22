const fs = require('fs')
const path = require('path')
const getAvatarUrl = require('../lib/twitter2')
const { getAllMeetups } = require('../lib/meetups')

syncAvatars()
  .then(() => {
    console.log('END.')
    process.exit(0)
  })
  .catch(function (e) {
    console.error(e)
    process.exit(1)
  })

async function syncAvatars() {
  const meetups = await getAllMeetups()
  const twitterUsers = [
    ...new Set(
      meetups
        .flatMap((m) => m.talks)
        .flatMap((t) => t.authors)
        .map((author) => author.avatar_twitter)
        .filter((avatar_twitter) => !!avatar_twitter)
    ),
  ]

  const destination = path.join(__dirname, `../content/avatars/twitter.json`)
  const result = (await fileExists(destination))
    ? JSON.parse(
        await fs.promises.readFile(destination, {
          encoding: 'utf-8',
        })
      )
    : {}

  for (const username of twitterUsers) {
    if (result[username]) {
      continue
    }
    try {
      // We should fetch the avatar from twitter
      const url = await getAvatarUrl(username)
      result[username] = url
    } catch (e) {
      console.warn(`not found @${username}`)
    }
  }

  // persist
  await fs.promises.writeFile(destination, JSON.stringify(result, null, 2), {
    encoding: 'utf-8',
    flag: '',
  })
}

async function fileExists(filename) {
  try {
    await fs.promises.stat(filename)
    return true
  } catch (e) {
    return false
  }
}
