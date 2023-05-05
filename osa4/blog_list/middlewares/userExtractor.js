const jwt = require('jsonwebtoken')

const userExtractor = (request, response, next) => {

    if (request.token) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        request.user = decodedToken
    }
    next()  
  }

module.exports = userExtractor