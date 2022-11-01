const { writeFile } = require('fs');
const { join } = require('path');
const axios = require('axios');
const mergeImg = require('merge-img');
const argv = require('minimist')(process.argv.slice(2));

let {
    greeting = 'Hello', who = 'You',
    width = 400, height = 500, color = 'Pink', size = 100,
} = argv;

const greetReq = {
// https://cataas.com/cat/says/Hi%20There?width=500&amp;height=800&amp;c=Cyan&amp;s=150
    url: 'https://cataas.com/cat/says/' + greeting + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size, encoding: 'binary'
};

const whoReq = {
    url: 'https://cataas.com/cat/says/' + who + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size, encoding: 'binary'
};

const saveMergedCatImage = _ => {
    const greetImage = fetchImage(greetReq.url);
    const whoImage = fetchImage(whoReq.url);

    axios.all([greetImage, whoImage])
    .then(async values=> { 
      const [greet, who] = values;
      const mergedImage = await mergeImages(greet, who);
      saveImage(mergedImage)
    })
}

const fetchImage = url => 
   axios.get(url, {
    responseType: 'arraybuffer'
  })
    .then(res => res.data)
    .catch(err => console.log('Error with request. ' + err))

const mergeImages = async (first, second) => 
    await mergeImg([ 
      { src: Buffer.from(first), x: 0, y:0 }, 
      { src: Buffer.from(second), x: width, y: 0 }
    ])
      .catch(err => console.log('Error with request. ' + err))    
    
const saveImage = image =>
{
    image.getBuffer('image/jpeg', (err, buffer) => {
      if (err) {
        console.log(err)
      }

      const fileOut = join(process.cwd(), `/cat-card.jpg`);
      
      writeFile(fileOut, buffer, 'binary', (err) => { if(err) {
          console.log(err);
          return; 
      }
      
      console.log("The file was saved!"); });
    }); 
}

saveMergedCatImage();
