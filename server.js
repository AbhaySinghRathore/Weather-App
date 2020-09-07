const express = require('express');
const request =require('request');
const path=require('path');
const app = express()
const port=3000


if (process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

const API_KEY=process.env.OpenWeatherMap_API_KEY

if (!API_KEY){
    throw new Error("Can't find API KEY");
}

app.use(express.static('public'))

app.use(express.urlencoded({
    extended: true
  }))


app.set('view engine','ejs');



app.get('/',(req,res)=>{
    res.render(path.join(__dirname+'/index.ejs'),{
        weather: null,
        error: null
    });
})


app.post('/',(req,res)=>{
    


    let city=req.body.city
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    request(url,(err,response,body)=>{

        if (err) {
            res.render(path.join(__dirname+'/index.ejs'), {
                weather: null,
                error: 'Error, please try again!'
            });
        }else {
            let weather_json = JSON.parse(body);
            if (weather_json.main == undefined) {
                res.render(path.join(__dirname+'/index.ejs'), {
                    weather: null,
                    error: 'Error, please try again!'
                });
            } else{
                let weather={
                    city: city,
                    temperature: weather_json.main.temp,
                    description: weather_json.weather[0].description,
                    icon: weather_json.weather[0].icon,
                    wind: weather_json.wind.speed
                }
        
                weather_data={weather:weather,error:null};
        
                res.render(path.join(__dirname+'/index.ejs'),weather_data);
            }
        }
    })

    
})




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
