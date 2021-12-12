export default class Post {
  constructor(title, img, url) {
    this.title = title
    this.img = img
    this.url = url
    this.date = new Date()
  }

  toString() {
    return JSON.stringify({
      title: this.title,
      date: this.date.toJSON(),
      // img: this.img,
      url: this.url,
    }, null, 2)
  }

  get uppercaseTitle() {
    return this.title.toUpperCase()
  }
}
