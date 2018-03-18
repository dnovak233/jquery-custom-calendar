const express = require('express');
const path = require('path');
const app = express();

app.use('/assets', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile('calendar.html', {root: __dirname })
});

app.get('/calendar', function(req, res){
    res.json([
        {title: "Prvi event", start: "2018-03-18"},
        {title: "Drugi event", start: "2018-03-18"},
        {title: "Treci event", start: "2018-03-17"}
    ]);
});

app.listen(8000, function(){
    console.log(`Server started at <http://localhost:8000/>`);
})