const getTwitterProfile = require('../../../../lib/twitter')

export default function personHandler({ query: { provider, username } }, res) {
  // We only support twitter for now
  return getTwitterProfile(username)
    .then((url) => {
      res.setHeader('Cache-Control', 's-maxage=3600, public')
      res.redirect(302, url)
    })
    .catch((e) => {
      res.status(404).send('error')
    })
}
