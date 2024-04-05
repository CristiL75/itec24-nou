const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { LogInCollection } = require("C:/Users/OWNER/Desktop/monitoring-app/src/mongo.js");

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const { email, username, password } = req.body;

    try {
        if (!email || !username || !password) {
            return res.status(400).send("Missing required fields");
        }

        const existingUser = await LogInCollection.findOne({ name: username });

        if (existingUser) {
            return res.send("Username already used");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await LogInCollection.create({ email, name: username, password: hashedPassword });

            return res.redirect("/");
        }
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send("Error registering user");
    }
});
app.get("/", (req, res) => {
    res.render("login"); 
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userData = await LogInCollection.findOne({ email });

        if (!userData) {
            return res.send("Username cannot be found");
        }
        
        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if (isPasswordMatch) { 
            req.session.username = userData.name;
            return res.redirect("/home");
        } else {
            return res.send("Wrong password");
        }
    } catch (error) {
        console.error(error);
        return res.send("Error authenticating user");
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
