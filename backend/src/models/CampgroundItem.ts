export interface CampgroundItem {
  title: string
  campgroundId: string
  author: string
  images: {
    url: string
    filename:string
  }
  price:number
  description: string
  location: string
  reviews: string[]
}
