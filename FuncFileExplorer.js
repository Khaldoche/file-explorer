let dir2Refresh = [];


function doInnerHtml(filesList, id,dir )
{
    let inHtml = "<ul id='ul"+ id + dir + "'>\n";
    for(const token of filesList)
    {
        let tokens = token.split(";");
        console.log(tokens[0]);
        if (tokens[0] == 'dir')
                {
                    inHtml += "<div onclick='getDir(\"" + dir + "/" + tokens[1] + "\"," + id +", true);' id='div" + id + dir + "/" + tokens[1];
                    inHtml += "'></div>  <li class='dir' id='" + id + dir + "/" + tokens[1];
                    inHtml += "' value='" + tokens[1] + "'>" + tokens[1] + "</li>\n";
                }
        else    {   inHtml +=  "<div id='div" + id + dir + "/" + tokens[1] + "'></div>    <li class='file " + tokens[2]  
                    inHtml +=  "' id='" + id + dir + "/" + tokens[1] +  "'>" + tokens[1] + "</li>\n";
                }
    }
    inHtml += "</ul>\n";

    return inHtml;
}

function getDir(dir, id, devDir)
{
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            let datas = JSON.parse(this.responseText);
           // console.log(datas[0]);
           let li = document.getElementById(id + dir);
           let div = document.getElementById("div" + id + dir);
           let typeFile = devDir ? datas[0] : "root";
           if (  typeFile != "nodir")
           {
                //div.className ="divActive";
                div.onclick = function() { toggleVisibility("ul" , id + dir )};
                li.innerHTML +=  doInnerHtml(datas[1], id, dir);
                let ul  = document.getElementById("ul" + id + dir);
                if (!devDir) ul.style.display = "none";
                li.className = "dir";
                if (devDir) li.className = "dirdev";
                li.setAttribute("hash", datas[0]);
                dir2Refresh.push([id, dir, typeFile]);
           }
           else { if (div.getAttribute("base") == "root") li.className="nodir"; }
        }
    };
    xhttp.open("GET", "/getDir?dir=" + dir , true);
    xhttp.send();
}

function refreshDir(indexDir)
{
    let id      = dir2Refresh[indexDir][0];
    let dir     = dir2Refresh[indexDir][1];
    let hash    = dir2Refresh[indexDir][2];
    let xhttp   = new XMLHttpRequest();

    xhttp.open("GET", "/refreshDir?dir=" + dir + "&hash=" + hash, false);
    xhttp.send();
    let datas = JSON.parse(xhttp.responseText);
    
    if ((datas[0] != hash) && (datas[0] != "nodir"))
    {
        let ulOld = document.getElementById("ul" + id + dir);
        let ulNew = document.createElement("ul");
        let li = document.getElementById(id + dir);
        let divDir = document.getElementById("div" + id + dir );
        ulNew.id = "ul" + id + dir;
        ulNew.style.display = ulOld.style.display;
        if (li.className == "nodir") { 
            li.className = "dir";
            divDir.setAttribute("onclick","getDir('" + dir + "' ," + id + ",true );");
        }
        for(const token of datas[1])
        {
            let tokens = token.split(";");
            let divId = "div" + id + dir + "/" + tokens[1];
            let liId = id + dir + "/" + tokens[1];
            let divDir = document.getElementById(divId);
            let liDir = document.getElementById(liId);

            if (divDir == null)
                 {
                    divDir = document.createElement("div");
                    liDir = document.createElement("li");
                    divDir.id = "div" + id + dir + "/" + tokens[1];
                            
                    liDir.id = id + dir + "/" + tokens[1];
                    liDir.value = tokens[1];
                    liDir.innerHTML = tokens[1];

                    if (tokens[0] == 'dir')
                            {   divDir.setAttribute("onclick","getDir('" + dir + "/" + tokens[1] + "' ," + id + ",true );");
                                liDir.className = "dir"; 
                            } 
                    else        liDir.className = "file " + tokens[2];    
                            
                 }
            ulNew.appendChild(divDir);
            ulNew.appendChild(liDir);
        }
        li.replaceChild(ulNew, ulOld);

        li.setAttribute("hash", datas[0]);
        dir2Refresh[indexDir][2] = datas[0];
    } 
    else { 
            if (datas[0] == "nodir") 
            {   let div = document.getElementById("div" + id + dir);
                let li  = document.getElementById(id + dir);
                let ul  = document.getElementById("ul" + id + dir);
                if (div.getAttribute("base") == "root") {
                    li.className = "nodir";
                    ul.style.display = "none";
                    div.setAttribute("onclick", ";");
                    li.setAttribute("hash","0");
                    dir2Refresh[indexDir][2] = "0";
                } else dir2Refresh.indexSplice(indexDir,1);
            }
        }
}

function refresh()
{
    for (let index = 0; index < dir2Refresh.length; index++) 
    {
       refreshDir(index);
    }
}

function toggleVisibility(prefixe,id) 
{
    let ul = document.getElementById(prefixe +id);
    let li = document.getElementById(id);
    if (ul.style.display === "none") 
            {
                ul.style.display = "block";
                li.className = "dirdev";
            }
    else    {
                ul.style.display = "none";
                li.className = "dir";
            }
}

function init()
{
    let listLi = document.getElementsByTagName("li");
    let i = 1;
    for(const li of listLi)
    {
        if (li.className == "dir")  getDir(li.getAttribute("value") , i, false);     
        i++;
    }
    setInterval(refresh, 3000);
}
