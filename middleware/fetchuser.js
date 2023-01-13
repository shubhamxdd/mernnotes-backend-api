const jwt = require("jsonwebtoken");
const jwt_secret = "mainahibataunga";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, jwt_secret)
    req.user = data.user
    next()
    
  } catch (error) {
    res.sendStatus(401).send({error: "Please authenticate using a valid token"})
    // send -> sendStatus
    
  }



};

module.exports = fetchuser;
