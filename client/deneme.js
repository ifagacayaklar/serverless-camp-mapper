const axios = require('axios');
const {apiId} = require('./config');


async function create() {
    const newCampground = {
        "title": "other",
        "price": 2,
        "location": "Alabam",
        "description": "This is other"
    }

    const username = 'deneme'
    const options = { headers: { username : username, 'Content-Type': 'application/json' } }
    const payload = { ...newCampground }
    const res = await axios.post(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds`, payload, options)
    console.log(res)
}


async function getOne() {
    
    const campgroundId = '3d1472a1-851b-4841-b389-e155b4bc95c4'
    const res = await axios.get(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}`)
    console.log(res.data)
}
// getOne()


async function auth() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjE0NjMzMjU2fQ.f5qkI6QBPCRmujlItuBWwVMndQddBcR578K4D6wuXYQ'
    const payload = {token:token}
    const res = await axios.post(
        `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/users/auth`, payload
    )
    console.log(res.data)
}

// auth()


async function update() {
    const newCampground = {
        "title": "helloo",
        "price": 2,
        "location": "Alabam",
        "description": "This is other"
    }
    const campgroundId = '3d1472a1-851b-4841-b389-e155b4bc95c4'
    const username = 'deneme'
    const options = { headers: { username : username, 'Content-Type': 'application/json' } }
    const payload = { ...newCampground }
    const res = await axios.patch(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}`, payload, options)
    console.log(res)
}

// update()

async function deleteCamp() {
    const campgroundId = '231035ac-db79-449c-b235-45af3ccfb56e'
    const username = 'admin'
    const options = { headers: { username : username, 'Content-Type': 'application/json' } }
    const res = await axios.delete(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/campgrounds/${campgroundId}` ,options)
    console.log(res)
}


async function createUser() {
    const newUser = {
        "email": "new@new.com",
        "username": "new",
        "password":"12345"
    }

    const options = { headers: {'Content-Type': 'application/json' } }
    const payload = { ...newUser }
    const res = await axios.post(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/users/register`, payload, options)
    console.log(res.data)
}

async function loginUser() {
    const newUser = {
        "username": "new",
        "password":"12345"
    }
    const options = { headers: {'Content-Type': 'application/json' } }
    const payload = newUser
    const res = await axios.post(`https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev/users/login`, payload, options)
    console.log(res.data)
}

loginUser()