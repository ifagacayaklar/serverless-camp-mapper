if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers'); 
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapboxToken = process.env.MAPBOX_TOKEN
// const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

mongoose.connect('mongodb://localhost:27017/camp-mapper', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const location = `${cities[random1000].city}, ${cities[random1000].state}`
        // const geoData = await geocodingClient.forwardGeocode({
        //     query: location,
        //     limit: 1
        // }).send()
        // geometry = geoData.body.features[0].geometry
        const camp = new Campground({
            author: "5feb1fb9de314702f994914b",
            location: location,
            title : `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            price: price,
            images:  [ 
                { 
                    "url" : "https://res.cloudinary.com/ifagacayaklar/image/upload/v1609631475/CampMapper/umwsbs5rr3ceewln3p3q.jpg", 
                    "filename" : "CampMapper/umwsbs5rr3ceewln3p3q" 
                }, 
                { 
                    "url" : "https://res.cloudinary.com/ifagacayaklar/image/upload/v1609631486/CampMapper/jqpurocipghxvfqt5itt.jpg", 
                    "filename" : "CampMapper/jqpurocipghxvfqt5itt" 
                }, 
                { 
                    "url" : "https://res.cloudinary.com/ifagacayaklar/image/upload/v1609631490/CampMapper/a925m3uwtcgdi5pqeydl.jpg", 
                    "filename" : "CampMapper/a925m3uwtcgdi5pqeydl" 
                }, 
                { 
                    "url" : "https://res.cloudinary.com/ifagacayaklar/image/upload/v1609631493/CampMapper/ahiciexbdycqudpzmkza.jpg", 
                "filename" : "CampMapper/ahiciexbdycqudpzmkza" 
                }
            ],
            geometry : {
                type: "Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        });
        await camp.save();
    }
    console.log("Finished")
}

seedDB();