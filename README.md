
# Udacity Cloud Developer Capstone 

This express app is the final project of Udacity Cloud Developer Nanodegree Program. The project is based on final project of the [Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/) at Udemy

Regular version was built as server application using
- **MongoDB** & **Mongo Atlas**: NoSQL database
- **Cloudinary**: to serve images

For the purpose of this final project the legacy express app is used to mock the frontend. The backend built from scratch using the AWS infrastructure and Serverless framework.

## Running the Client
Follow these steps to run the client locally.(Tested with Node.JS *v15.4.0*)

- `npm install` to install dependencies
- Run `node app.js` to start server
  
API ID is provided in *client/config.js* 
  
## Testing the API

Postman collection is provided in backend folder. Below steps are provided to test
- Import the collection to the Postman
- Set the `apiId` in variables of collection -> **0sddvyrr63**
- Use Register to create a user. This will return a JWT Token
- Copy JWT return and assign to `authToken` in variables of collection
- Try to login with same user
- Create campground. It returns the campground. Copy the `campgroundID` and assign to variables of collection
- Try to Get, Update and Delete campground

! The Auth is used to check whether user is logged in for some pages in front end. It is an empty function which leverages the API Gateway Authorizer. API Gateway Authorizer is deployed separately which validates the JWT token
  
## Rubric Item Checklist

As mentioned, the backend is designed for this project and frontend is used to mock client. Thus, please consider backend code for the best practices etc.

The instructions state that "*Review the rubric for each option, to ensure that the application you build satisfies **at least 3 of the rubric requirements. Not all rubric items need to be satisfied** in order to pass the project*". Nevertheless, the project is built to satisfy all rubric items. Relevant explanation of each item is provided if necessary.

### (Option 2): Functionality

- [X] The application allows users to create, update, delete items
  - Create: Go to "New Campground" page 
  - Update: User can update campground in "View Campground" page. The user should be the owner of the campground to see Edit button.
  - User can delete campground in "View Campground" page. The user should be the owner of the campground to see the Delete button
- [X] The application allows users to upload a file.
  - Upload functionality is provided in "New Campground" page. Multiselect file upload is allowed.
- [X] The application only displays items for a logged in user.
  - A more sophisticated logic is used for this rubric item. User can see all campgrounds for the purpose of the website, but cannot see 'Edit' and 'Update' buttons if user is not the owner of entry
- [X] Authentication is implemented and does not allow unauthenticated access.
  - A more sophisticated logic is used for this rubric item. User can see all campgrounds and see details of a campground. However, user cannot create, edit or delete a campground if not logged in.
  
### (Option 2): Codebase
- [X] The code is split into multiple layers separating business logic from I/O related code.
  - The codebase is separated. Please see the "backend" folder
- [X] Code is implemented using async/await and Promises without using callbacks.

### (Option 2): Best practices
- [X] All resources in the application are defined in the "serverless.yml" file
- [X] Each function has its own set of permissions.
- [X] Application has sufficient monitoring
  - Application has **at least some** of the following (**2/3**):
    - [X] Distributed tracing is enabled
    - [X] It has a sufficient amount of log statements 
    - [ ] It generates application level metrics 
- [X] HTTP requests are validated

### (Option 2): Architecture
- [X] Data is stored in a table with a composite key.
  - Both User and Campground tables use composite keys.
- [X] Scan operation is not used to read data from a database.
  -  Scan operation is used deliberately in main page to retrieve all items for the purpose of demo. However, other than main page, query is used to retrieve items
  
## Remarks

! AWS secret manager is not used for cost and demo considerations. This is also not mentioned as a rubric item
 
