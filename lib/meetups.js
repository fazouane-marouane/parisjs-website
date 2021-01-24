// This file is used by both node and nextjs
const fs = require('fs').promises
const path = require('path')
const crypto = require('crypto')
const matter = require('gray-matter')

const meetupPath = path.join(process.cwd(), 'content/meetups')
const twitterAvatarsPath = path.join(
  process.cwd(),
  'content/avatars/twitter.json'
)

exports.getAllMeetupIds = getAllMeetupIds
exports.getMeetupData = getMeetupData
exports.getAllMeetups = getAllMeetups
exports.getTwitterAvatars = getTwitterAvatars
exports.saveTwitterAvatars = saveTwitterAvatars

async function getTwitterAvatars() {
  const file = await fs.readFile(path.join(twitterAvatarsPath), 'utf8')
  return JSON.parse(file)
}

async function saveTwitterAvatars(twitterAvatars) {
  await fs.writeFile(
    twitterAvatarsPath,
    JSON.stringify(twitterAvatars, null, 2),
    'utf-8'
  )
}

async function getAllMeetupIds() {
  const filenames = await fs.readdir(meetupPath)
  return filenames.map((filename) => filename.split('.')[0])
}

async function getMeetupData(id, twitterAvatars) {
  const file = await fs.readFile(path.join(meetupPath, `${id}.md`), 'utf8')
  const { data } = matter(file)
  for (const talk of data.talks) {
    for (const author of talk.authors) {
      if (author.avatar && author.avatar.startsWith('twitter/')) {
        const username = author.avatar.slice(8)
        author.twitter_username = username
        author.avatar = twitterAvatars[username] || null
      }
    }
  }
  const meetup = {
    ...data,
    id,
    dateUnix: new Date(data.date).getTime(),
    objectID: data.edition,
    hash: md5(JSON.stringify(data)),
  }

  return meetup
}

async function getAllMeetups() {
  const ids = await getAllMeetupIds()
  const twitterAvatars = await getTwitterAvatars()
  const meetups = []

  for (const id of ids) {
    meetups.push(await getMeetupData(id, twitterAvatars))
  }

  return meetups
}

function md5(m) {
  return crypto.createHash('md5').update(m).digest('hex')
}
