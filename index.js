const fs = require('fs');
const path = require('path');
const jsonMerger = require("json-merger");
const data = require('./final_formatted.json');

const getHashtags = (data) => {
  const hashtags = [];
  data.map(tweet => {
    if (tweet.entities != undefined){
      if (tweet.entities.hashtags != undefined){
        let tags = tweet.entities.hashtags;
        tags.map(hashtag => {
          hashtags.push({
            "hashtag": `${hashtag.tag}`
          });
        })
      }
    }
  })
  /* const counts = {};
  for (const tag of hashtags){
    counts[tag] = counts[tag] ? counts[tag] + 1 : 1;
  }
  let sortable = [];
  for (var tag in counts){
    sortable.push([tag, counts[tag]]);
  }
  sortable.sort(function(a, b){
    return b[1] - a[1];
  })
  return sortable; */

  return hashtags
}

const getMentions = (data) => {
  const mentions = [];
  data.map(tweet => {
    if (tweet.entities != undefined){
      if (tweet.entities.mentions != undefined){
        let usernames = tweet.entities.mentions;
        usernames.map(mention => {
          mentions.push({
            "created_at": `${tweet.created_at}`,
            "username": `${mention.username}`
          });
        })
      }
    }
  })
  /* const counts = {};
  for (const mention of mentions){
    counts[mention] = counts[mention] ? counts[mention] + 1 : 1;
  }
  let sortable = [];
  for (var mention in counts){
    sortable.push([mention, counts[mention]]);
  }
  sortable.sort(function(a, b){
    return b[1] - a[1];
  })
  console.log(sortable); */
  return mentions;
}

const getContextAnnotations = (data) => {
  const context_annotations = [];
  const created_at = [];
  data.map(tweet => {
    if (tweet.context_annotations != undefined){
      let annotations = tweet.context_annotations;
      annotations.map(annotation => {
        created_at.push({
          "created_at": `${tweet.created_at}`,
          "name": `${annotation.entity.name}`
        });
        context_annotations.push(annotation.entity.name);
      })      
    }
  })
  const counts = {};
  for (const annotation of context_annotations){
    counts[annotation] = counts[annotation] ? counts[annotation] + 1 : 1;
  }
  let sortable = [];
  for (var annotation in counts){
    sortable.push([annotation, counts[annotation]]);
  }
  sortable.sort(function(a, b){
    return b[1] - a[1];
  })
  console.log(sortable);
  return(sortable);
}

const getLinks = (data) => {
  const links = [];
  data.map(tweet => {
    if (tweet.entities != undefined){
      if (tweet.entities.urls != undefined){
        let urls = tweet.entities.urls;
        urls.map(url => {
          links.push({
            "url": `${url.expanded_url}`,
            "created_at": `${tweet.created_at}`,
          });
        })
      }
    }
  })
  return links
}

const getImages = (data) => {
  const images = [];
  data.map(tweet => {
    if (tweet.entities != undefined){
      if (tweet.entities.urls != undefined){
        let urls = tweet.entities.urls;
        urls.map(url => {
          if (url.images){
            images.push({
              "url": `${url.images[0].url}`,
              "created_at": `${tweet.created_at}`,
            });
        }
        })
      }
    }
  })
  return images
}

const removeDuplicates = (data) => {
  const uniqueIds = [];
  const unique = data.filter(element => {
    const isDuplicate = uniqueIds.includes(element.id);

    if (!isDuplicate) {
      uniqueIds.push(element.id);

      return true;
    }
    return false;
  });
  console.log(unique)
  return unique
}

const mergeJsonFiles = () => {
  const arr = [];

  fs.readdir(path.join(process.cwd(), "./rawData/"), (err, fileNames) => {
    if (err) throw console.log(err.message);
    // Loop fileNames array
    fileNames.forEach((filename) => {
      let result = jsonMerger.mergeObjects([filename]);
      // Read file content
      fs.readFile(
        path.join(process.cwd(), "./rawData/", `${filename}`),
        (err, data) => {
          if (err) throw console.log(err.message);
          // Loop through content array
          // Log file content
          const stringData = JSON.stringify(data)
          if (JSON.parse(stringData) != undefined)
            arr.push(stringData.toString())
          const buf = Buffer.from(JSON.stringify(data))          
            if (buf !== undefined)
              arr.push(JSON.parse(buf.toString()))
          fs.writeFileSync(
            "./formattedData/output.json", JSON.stringify(arr), 'utf-8', function (err) {
            if (err) {
              return console.log(err)
            }      
            console.log("The file was saved!")
          });

          /*const output = JSON.parse(data);
          arr.push(output);
           fs.writeFileSync(
            path.join(process.cwd(), "./rawData/", `output.json`),
            JSON.stringify(arr),
            (err) => {
              if (err) throw console.log(err.message);
            }
          ); */
          console.log(arr)
        }
      );
    });
  });
}

fs.writeFileSync('./formattedData/final_annotations.json', JSON.stringify(getContextAnnotations(data)))
/* 
Cria arquivo com json formatado
*/

/* fs.writeFileSync('./images_25_08.json', JSON.stringify(removeDuplicates(data))); */


/* let counter = 0;
for (const obj of data) {
  if (obj.id !== null) counter++;
}

console.log(`Número de tweets: ${counter}`); */