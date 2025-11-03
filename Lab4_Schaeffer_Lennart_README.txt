# Activity L10

**[Optional]** If what is being submitted is an individual Lab or Assignment. Otherwise, include a brief one paragraph description about the project.

- Date Created_: 02 11 2025
- Last Modification Date_: 02 11 2025
- Netlify URL: https://meme-generator-csci3172.netlify.app/
- GitLab URL_: https://git.cs.dal.ca/schaeffer/csci-3172/-/tree/main/labs/lab4/

## Authors

If what is being submitted is an individual Lab or Assignment, you may simply include your name and email address. Otherwise list the members of your group.

- Lennart Schaeffer - ln546006@dal.ca

## Application Description

This is a full-stack meme generator web application that allows users to upload images and add custom text to create memes. 
The application features a frontend built with Bootstrap that communicates with a Node.js/Express backend API. 
Users can upload images, preview them, add top and bottom text, and generate memes that are hosted via ImgBB. 

## Built With

- HTML
- CSS
- JavaScript
- Node.js : https://nodejs.org/en
- Express.js : https://expressjs.com/
- Bootstrap 5.3 : https://getbootstrap.com/docs/5.3/getting-started/introduction/
- Netlify : https://www.netlify.com/
- Jest, Supertest : https://jestjs.io/
- ImgBB API (Image hosting for memes)- https://imgbb.com/
- Memegen API (generating memes with the hosted image) - https://memegen.link/

## APIs used
  - ImgBB API (Image hosting for memes) - https://imgbb.com/
  - Memegen API (generating memes with the hosted image) - https://memegen.link/

## Testing Strategy:

Backend:
   - GET endpoints return correct status codes and response data
   - POST endpoints properly handle meme generation requests
   - Error handling for invalid inputs or missing parameters
   - Image upload and ImgBB integration functionality

Frontend:
   - Manual browser testing across different devices and screen sizes
   - Form validation to ensure text inputs are properly captured
   - Image preview functionality before meme generation
   - Bootstrap responsive behavior verification

Issues fixed:
- Fixed CORS issues between frontend and backend during API calls
- Corrected Bootstrap grid layout inconsistencies
- All components functioned as expected after addressing these issues




## Acknowledgements
N/A
