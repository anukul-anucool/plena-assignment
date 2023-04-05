# plena-assignment




The provided code is a Node.js application that uses Express.js as a web framework, Mongoose to connect to a MongoDB database, and JSON Web Tokens for user authentication. The application provides endpoints to create, read, update and delete posts and comments.

The API has the following endpoints:

/login: POST endpoint that expects a JSON object with a username and a password property. The endpoint hashes the password using bcrypt and saves it to the database. It then returns a JSON object with an access token.

/posts: GET endpoint that retrieves a list of posts filtered by tag, user, startDate and endDate query parameters. The endpoint returns a JSON object with an array of posts.

/posts/:title: GET endpoint that retrieves a post by its title. The endpoint returns a JSON object with the post.

/posts: POST endpoint that creates a new post. The endpoint expects a JSON object with a title, description, tags, and an image property. The endpoint requires the user to be authenticated with a valid JWT.

/posts/:postId/comments: POST endpoint that creates a new comment for a post. The endpoint expects a JSON object with a text property. The endpoint requires the user to be authenticated with a valid JWT.

/posts/:postId: DELETE endpoint that deletes a post by its ID. The endpoint requires the user to be authenticated with a valid JWT and to be the author of the post.

/posts/:postId/comments/:commentId: DELETE endpoint that deletes a comment by its ID. The endpoint requires the user to be authenticated with a valid JWT and to be the author of the comment.
