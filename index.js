import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import 'dotenv/config';

const apiKey = process.env.APIKEY;

const app = express();
const port = 3000;

const day = new Date().getDay();
const month = new Date().getMonth();
const date = new Date().getDate();

const dayA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthA = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("./index.ejs");
});

app.get("/weather", (req, res) => {
    res.render("./weather.ejs");
});

app.post("/weather", async (req, res) => {
    let location = await req.body['user-location'];
    try {
        let requestgeo = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`);
        let resultgeo = requestgeo.data[0];
        let request = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${resultgeo.lat}&lon=${resultgeo.lon}&appid=${apiKey}&units=metric`);
        let result = request.data;
        res.render("./weather.ejs", {
            data: result,
            place: resultgeo.name,
            day: dayA[day],
            month: monthA[month],
            date: date,
        });
    }
    catch (error) {
        console.log("error at back: " + error);

        res.render("./error.ejs");
    }
});

app.listen(port, () => {
    console.log(`port has been started at ${port}.`);
});