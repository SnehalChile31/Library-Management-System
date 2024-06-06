const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');
const {registerSchema, loginSchema} = require('../schema/authSchema')
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    console.log("req", req.route.path.split('/')[2]);
    let model =  req.route.path.split('/')[2];
    
    const { email, password } = req.body;

    //schema validation
    let validation = registerSchema.validate(req.body);
    if (validation.error) {
        console.log('requestBody is invalid', validation.error);
        return res.status(400).json({ errors: validation.error });
    }

    // hashing the password before storing it into database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let user, isAdmin
      if (model == 'user') {
        isAdmin = false
        user = await User.create({ email, password: hashedPassword });
        console.log("user?.id", user?.id); 

      }else if(model == 'admin'){
        isAdmin = true
        user = await Admin.create({ email, password: hashedPassword });
        console.log("user?.id", user?.id); 
      }

      if(user?.id) {
        const token = jwt.sign({ id: user.id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({id: user.id, token});
      }else{
        console.log("authController.js, line no. 47", JSON.stringify(err));
        res.status(500).json({ error: err });
      }
  } catch (err) {
    console.log("authController.js, line no. 51", JSON.stringify(err));
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    //schema validation
    let validation = loginSchema.validate(req.body);
    if (validation.error) {
      console.log('requestBody is invalid', validation.error);
      return res.status(400).json({ errors: validation.error });
    }
      
    const { email, password, isAdmin } = req.body;
    const user = isAdmin
      ? await Admin.findOne({ where: { email } })
      : await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({id: user.id, token});

  } catch (err) {
    console.log("authController.js, line no. 114", JSON.stringify(err));
    res.status(500).json({ error: err });
  }
};
