const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

router.get("/auth", auth, async (req, res) => {
  try {
     const user = await User.findById(req.user.id).select('-password');
     return res.status(200).json(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});



router.post(
  "/auth/login",
  [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Password required').exists(),
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
     
    
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
          return res
            .status(400)
            .json({ errors: [{ message: "user not exist " }] });
          
      }

      const isCheck = await bcrypt.compare(password, user.password);

      if (!isCheck) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid password" }] });
    

      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
