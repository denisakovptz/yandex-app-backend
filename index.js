import express from 'express';
import cors from 'cors';
import request from 'request';

const app = express();

app.use(express.json());
app.use(cors());

app.post("/", (req, res) => {

   if (!req.body) return res.sendStatus(400);

   request.post({
      headers: {
         'Authorization': req.body.apiAuth
      },
      url: req.body.apiUrl,
      body: JSON.stringify(req.body.apiSet)
   }, function (error, response, body) {

      if (response.statusCode == 404) {
         console.log('====================');
         console.log('Yandex API server Not Found...');
         return res.status(404).send('Yandex API server Not Found...');
      }

      if (response.statusCode != 200) {
         console.log('====================');
         console.log('Bad Request...');
         console.log(body);
         return res.status(400).send(body);
      }

      if (req.body.apiUrl != 'https://api-sandbox.direct.yandex.com/json/v5/reports') {
         const json = JSON.parse(body);
         if (json.error) {
            console.log('====================');
            console.log('Bad Request...');
            console.log(body);
            return res.status(400).send(body);
         }
      }

      let data = "";
      let units = "";

      if (response) units = response.caseless.dict.units;

      if (units) {
         data = body.slice(0, -1) + `,"units":"${units}"}`;
      } else {
         data = body;
      }

      console.log('====================');
      console.log(data);
      return res.status(200).send(data);


   });

});


app.listen(8000, (err) => {
   if (err) {
      return console.log(err);
   }
   console.log('Server OK');
});