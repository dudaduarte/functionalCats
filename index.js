const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`
const ramda = CDN('ramda/0.25.0/ramda.min')
const jquery = CDN('jquery/3.0.0-rc1/jquery.min')

requirejs.config({ paths: { ramda, jquery } })
requirejs(['jquery', 'ramda'], ($, { path, pipe, curry, map, prop }) => {
  const Impure = {
    getJSON: curry((callback, url) => $.getJSON(url, callback)),
    setHtml: curry((sel, html) => $(sel).html(html)),
    trace: curry((tag, x) => { console.log(tag, x); return x; }),
  }

  const createImg = src => $('<img />', { src })

  const getImgUrls = map(path(['media', 'm']))

  const createImgTags = map(createImg)

  const extractUrls = pipe(
    prop('items'),
    getImgUrls
  )

  const render = Impure.setHtml('#js-main')

  const handleResponse = pipe(
    extractUrls,
    createImgTags,
    render
  )

  const host = 'api.flickr.com'
  const route = '/services/feeds/photos_public.gne'
  const query = t => `?tags=${t}&format=json&jsoncallback=?`
  const url = t => `https://${host}${route}${query(t)}`

  const app = pipe(
    url,
    Impure.getJSON(handleResponse)
  )

  app('cats')
})
