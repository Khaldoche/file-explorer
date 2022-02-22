const express = require('express');
const path    = require('path');
const crypto  = require('crypto');
const fs      = require('fs');
const app     = express();
const port    = 8080;

const extension = ["txt","c","js","sql","docx","doc","py","xlsx","xls","xlsm","pdf","html","css","bat","exe","csv","json","png","gif","svg","jpg","jpeg"];

app.get('/file-explorer', (req, res) => 
{
    fs.readFile('FileExplorer.html', 'utf8', function(err,data)
    {
      if (err){
                console.log('Erreur de lecture du fichier FileExplorer.html : '+ err + "\n");
              }  
      else    {
                const argsDir = process.argv.slice(2);
                
                if (argsDir.length == 0) argsDir.push(process.cwd());
                let rootExploreurHtml = "";
                let i=1;
                argsDir.forEach (function(dir ) 
                { 
                  if (fs.existsSync(dir))
                      {
                        rootExploreurHtml += "<div base='root' onclick='getDir(\"" + dir + "\"," + i +", true);' id='div"+ i + dir;
                        rootExploreurHtml +=  "'></div>  <li class='dir' id='" + i + dir + "' value='" + dir + "'>" + dir + "</li>\n";
                      }
                  else  rootExploreurHtml += "<div ></div>  <li class='nodir' >" + dir + "</li>\n";
                  i++;
                });
                let newHtml = data.replace("#FileExploreur#", rootExploreurHtml)
                res.send(newHtml);
              }
    })
})

app.get('/ReadFile', function(req, res)
{
    fs.readFile(req.query.fileName, function(err,data)
    {
        if (err)
              {
                  console.log('Erreur de lecture du fichier ' + req.query.fileName + ' : ' + err + "\n");
              }  
        else  {
                  console.log("Chargement " + req.query.fileName + "\n");
                  res.setHeader("Content-Type", req.query.typeFile);
                  res.send(data);
              }
    })
})

function readAndSortDir(dirPath) 
{
  let listFiles = [];

  let files = fs.readdirSync(dirPath); 

  let typeFile, extFile;
  files.forEach(function(file) 
  {
    typeFile = fs.statSync(dirPath + "/" + file).isDirectory() ? "dir" : "file";
    extFile = typeFile == "file" ? path.extname(file) : "";
    extFile = extFile.replace(".","");
    if (!extension.includes( extFile) ) extFile = "txt";
    listFiles.push(typeFile + ";" + file + ";" + extFile);
  });
  
  return listFiles.sort(function (f1, f2) {
                                            return f1.toLowerCase().localeCompare(f2.toLowerCase());
                                          });
}

app.get('/getDir', function(req, res)
{
  let dirPath = req.query.dir;
  let hash = "nodir";
  let listFiles = [];
  if (fs.existsSync(dirPath))
  {
    listFiles = readAndSortDir(dirPath);
    hash = crypto.createHash('md5').update(listFiles.toString()).digest('hex').toString();
    console.log("Lecture du répertoire : " + dirPath + "   hash: " + hash + "\n");
  } 
  res.send([hash, listFiles]);
})

app.get('/refreshDir', function(req, res)
{
  let dirPath = req.query.dir;
  let oldHash = req.query.hash;
  let hash = "nodir";
  let listFiles = [];
  if (fs.existsSync(dirPath))
  {
    listFiles = readAndSortDir(dirPath);
    hash = crypto.createHash('md5').update(listFiles.toString()).digest('hex').toString();
    listFiles = oldHash == hash ? [] : listFiles;
    console.log("Lecture du répertoire : " + dirPath + "   hash: " + hash + "\n");
  }
  res.send([hash, listFiles]);
})

app.use ( function(req, res)
{
    res.send('Page introuvable');
})

/******************************** Lancement du navigateur firefox */

const {Builder, By, Key, util} = require('selenium-webdriver');

(async function launchExplorer() {
  let driver = await new Builder().forBrowser('firefox').build();
  try        {
                  driver.manage().window().maximize();
                  await driver.get('http://localhost:8080/file-explorer');
              } 
  catch(err) {
                  console.log("Erreur selenium driver: " + err + "\n");
                  await driver.quit();
             }
})();

app.listen(port, () => 
{
  console.log('Serveur en écoute sur le port:%d',port);
})