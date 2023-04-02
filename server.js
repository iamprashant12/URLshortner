const express = require("express");
const mongoose = require("mongoose");
const shortId = require("shortid")

const ShortUrl = require("./models/shortUrl");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost/urlShortner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ejs is the templating language we are using and we have installed the package to handle ejs
//set view engine
app.set("view engine", "ejs");

// allow express to user body parameters
app.use(
  express.urlencoded({
    extended: false,
  })
);

// GET - localhost:PORT/ - landing page
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

// POST - localhost:PORT/shortUrls - endpoint to create url shortner
app.post("/shortUrls", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ full: req.body.fullUrl });
  if(!shortUrl)
  await ShortUrl.create({ full: req.body.fullUrl });
  else{
    shortUrl.short = shortId.generate();
    shortUrl.save();
  }
  res.redirect("/");
});

// GET - localhost:PORT/:short - on clicking the short url the page is redirected to the original link
app.get("/:short", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.short });
  if (shortUrl == null) {
    res.sendStatus(404);
  }
  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
