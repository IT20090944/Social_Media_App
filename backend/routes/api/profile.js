const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

router.get("/auth/profile", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "No profile for this user" });
    }

    res.json({ profile });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

/////////////////////////////Adding profile//////////////////////////////////////////

router.post(
  "/auth/addprofile",
  [
    auth,
    [
      check("status", "status required").not().isEmpty(),
      check("skills", "Skills required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    profileFields.social = {};

    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.facebook = twitter;

    try {
      //if there is a profile update records

      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
      }

      //////////////create profile//////////////////////////////////////

      profile = new Profile(profileFields);

      profile.save();

      return res.status(200).json({profile})
    } catch (error) {

        console.log(error.message);
        res.status(500).send('Server error')
        
    }
  }
);

module.exports = router;
