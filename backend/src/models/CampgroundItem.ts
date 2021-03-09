export interface CampgroundItem {
  title: string
  campgroundId: string
  author: string
  images: {
    url: string
    filename:string
  }[]
  price:string
  description: string
  location: string
}
