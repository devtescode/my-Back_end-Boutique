const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let schema = mongoose.Schema({
  Username: { type: String, required: true },
  Number: { type: Number, required: true },
  Email: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },

  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      state: { type: String, required: true },
      city: { type: String, required: true },
    }
  ]
});

const saltRounds = 10;
schema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.Password, saltRounds);
      this.Password = hashedPassword;
      next();
    } catch (err) {
      console.error("Error hashing password:", err);
      next(err);
    }
  } else {
    next();
  }
});

schema.methods.compareUser = async function (userPass) {
  try {
    return await bcrypt.compare(userPass, this.Password);
  } catch (err) {
    console.log(err);
  }
};

const Userschema = mongoose.model("usercallerfetch", schema);
module.exports = { Userschema };
