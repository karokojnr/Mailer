const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const chalk = require("chalk");

const port = process.env.PORT || 5000;

const app = express();

//MIDDLEWARE
//View engine setup

app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  exphbs({
    layoutsDir: __dirname + "/views/",
    defaultLayout: "contact"
  })
);

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact");
});
app.post("/send", (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.phone}</p>
    `;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.something.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@something.com", // generated ethereal user
      pass: "something" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false //running from localhost
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Nodemailer Contact" <info@something.com>', // sender address
    to: "something.com", // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { msg: "Email has been sent" });
  });
});

app.listen(port, () =>
  console.log("Server running on port:" + chalk.blueBright(`${port}`))
);
