function csRankings()
{
    var groupConferences = true;
    const authornumPublicationsThresholdOverAllTimesteps = 30;
    const timestepBinSize = 5; //Number of years in a bin/timestep
    const maxNumOfTimesteps = 10;
    var timestep_yearsarray_dict={};
    var csrankingsArray =  window.csRankingsJSON;
    // console.log(csrankingsJSON);
    var conferenceNamesSet= new Set();
    var areaNamesSet = new Set();
    var yearsSet = new Set();
    var areaNamesDict={};
    window.authorInfo={};
    window.institutionsDictionary = {};

    // variables to parse paper titles for interaction edges
    window.paperTitleDictionary = {};
    

    for(var ob of csrankingsArray)
    {
        if(!(conferenceNamesSet.has(ob.conf)))
            conferenceNamesSet.add(ob.conf)
        if(!(areaNamesSet.has(ob.area)))
         {
               areaNamesSet.add(ob.area);
               areaNamesDict[ob.area] = {"count":0,"papers":[]};
         }
         if(!(yearsSet.has(ob.year)))
            yearsSet.add(ob.year)
    }
    // console.log(conferenceNamesSet, areaNamesSet);
    var yearsArray = [];
    yearsSet.forEach(function(key, value, set){
        // console.log(key, value, set);
        yearsArray.push(key);
    });
    yearsArray.sort();
    yearsArray.reverse();
    var isYearExceeded = false;
    for(var i=0; i<maxNumOfTimesteps; i++)
    {
        if(!(isYearExceeded))
        {
            var binYearsArray = [];
            for(var j=0; j<timestepBinSize;j++)
            {
                if(!(isYearExceeded))
                { 
                    var tindex = (timestepBinSize*i)+j;
                    if(tindex >= (yearsArray.length-1))
                    {
                        tindex = yearsArray.length-1;
                        isYearExceeded = true;
                    }
                    binYearsArray.push(yearsArray[tindex]);
                }
            }
            timestep_yearsarray_dict[maxNumOfTimesteps-i] = binYearsArray;
        }
    }
    // console.log(timestep_yearsarray_dict);
    var year_timestepnum_dict={};
    for(var t in timestep_yearsarray_dict)
    {
        for(var y of timestep_yearsarray_dict[t])
            year_timestepnum_dict[y] = t;
    }
    // console.log(year_timestepnum_dict);
    window.year_author_area_dict = {};
    for(var ob of csrankingsArray)
    {
        if(ob.year in year_timestepnum_dict)
        {
            //year does not exist
            if(!(year_timestepnum_dict[ob.year] in year_author_area_dict))
            {
                year_author_area_dict[year_timestepnum_dict[ob.year]] = {};
                year_author_area_dict[year_timestepnum_dict[ob.year]][ob.name] = JSON.parse(JSON.stringify(areaNamesDict));
                year_author_area_dict[year_timestepnum_dict[ob.year]][ob.name][ob.area].count++;
                year_author_area_dict[year_timestepnum_dict[ob.year]][ob.name][ob.area].papers.push(ob);
            }
            // year exists
            else
            {
                //author does not exist
                if(!(ob.name in year_author_area_dict[year_timestepnum_dict[ob.year]]))
                {
                    year_author_area_dict[year_timestepnum_dict[ob.year]][ob.name] = JSON.parse(JSON.stringify(areaNamesDict));
                    year_author_area_dict[year_timestepnum_dict[ob.year]][ob.name][ob.area].count++;
                    year_author_area_dict[year_timestepnum_dict[ob.year]][ob.name][ob.area].papers.push(ob);

                }
                if(!(ob.name in authorInfo))
                {
                    authorInfo[ob.name] = {"institution":ob.institution};
                    
                }
                

                // author exists
                else
                {
                    year_author_area_dict[year_timestepnum_dict[ob.year]][ob.name][ob.area].count++;
                    year_author_area_dict[year_timestepnum_dict[ob.year]][ob.name][ob.area].papers.push(ob);
                }


            }
        }
    }

    var domain_conf_dict ={
        "AI/ML": ["ijcai","aaai","icml","nips","kdd"],
        // "Computer Vision": ["cvpr","eccv","iccv"],
        "NLP": ["acl","emnlp", "naacl"],
        // "The Web":[],
        "Computer Architecture":["asplos", "isca", "micro","hpca"],
        // "Computer Networks":[],
        // "Operating Systems":["osdi","sosp","eurosys","fast","usenixatc"],
        "Software Engineering":["fse","icse","ase","issta"],
        // "Algorithms":["focs", "soda", "stoc"],
        // "Robotics":["icra","iros","rss"],
        "Graphics/Vis./HCI":["vis","vr","siggraph","siggraph-asia","chi","uist","ubicomp"]
    }

    // console.log(year_author_area_dict);

    var conf_domain_dict = {};
    var selectedConferences = ["vis","vr","siggraph","siggraph-asia","chi","uist","ubicomp"];
    if(groupConferences)
    {
        for(var domain in domain_conf_dict)
        {
            for(var conf of domain_conf_dict[domain])
            {
                conf_domain_dict[conf] = domain;
            }
        }
    }
    else{
        for(var conf of selectedConferences)
            conf_domain_dict[conf] = conf;
    }

    var filteredDataOfConferences = {};

    for(var year in year_author_area_dict)
    {
       
        for(var author in year_author_area_dict[year])
        {

            for(var area in year_author_area_dict[year][author])
            {
                if(area in conf_domain_dict)
                {
                    if(!(year in filteredDataOfConferences))
                    {
                        filteredDataOfConferences[year] = {};
                    }
                    if(!(author in filteredDataOfConferences[year]))
                    {
                        filteredDataOfConferences[year][author] = {};
                    }

                    if(!(conf_domain_dict[area] in filteredDataOfConferences[year][author]))
                    {
                        filteredDataOfConferences[year][author][conf_domain_dict[area]] = {"count":0, "papers":[]};
                    }
                    
                    
                    filteredDataOfConferences[year][author][conf_domain_dict[area]].count += year_author_area_dict[year][author][area].count;
                    filteredDataOfConferences[year][author][conf_domain_dict[area]].papers = filteredDataOfConferences[year][author][conf_domain_dict[area]].papers.concat(year_author_area_dict[year][author][area].papers);

                    
                }
            }
        }
    }
    console.log(filteredDataOfConferences);
    var author_numPublications_dict={};
    
    for(var year in filteredDataOfConferences)
    {
        for(var author in filteredDataOfConferences[year])
        {
            if(!(author in author_numPublications_dict))
                author_numPublications_dict[author] = 0;

            for(var area in filteredDataOfConferences[year][author])
            {
                author_numPublications_dict[author] += filteredDataOfConferences[year][author][area].count;
            }
        }
    }

    for(var author in author_numPublications_dict)
    {
        if(author_numPublications_dict[author]<authornumPublicationsThresholdOverAllTimesteps)
            delete author_numPublications_dict[author];
    }

    for(var year in filteredDataOfConferences)
    {
        for(var author in filteredDataOfConferences[year])
        {
            if(!(author in author_numPublications_dict))
            {
                delete filteredDataOfConferences[year][author];
            }
            else
            institutionsDictionary[window.authorInfo[author].institution] = 1;
        }
    }

    console.log("Number of authors: ",Object.keys(author_numPublications_dict).length,"  ",author_numPublications_dict);

    // creating paper title dictionary
    for(var index in csrankingsArray)
    {
        var ob = csrankingsArray[index];
    
        // var temphash = hash(ob.title);
        var temphash = ob.title;
        ob.hash = temphash;
        if(ob.conf.toLowerCase() in conf_domain_dict)
        {
            if(!(temphash in paperTitleDictionary))
            {
                if(ob.name in author_numPublications_dict)
                {
                    var timestep = -1;
                    for(var y in timestep_yearsarray_dict)
                    {
                        if(timestep_yearsarray_dict[y].includes(ob.year))
                        {
                            timestep = y-1;
                            break;
                        }
                    }
                    if(timestep != -1)
                        paperTitleDictionary[temphash] = {authors: [ob.name], title: ob.title, year:ob.year, area: ob.area, conf:ob.conf, timestep: timestep};
                }
            }
            else
            {
                if(ob.title === paperTitleDictionary[temphash].title)
                {
                    if(!(ob.name in paperTitleDictionary[temphash].authors))
                    {
                        if(ob.name in author_numPublications_dict)
                            paperTitleDictionary[temphash].authors.push(ob.name);
                    }
                }
                else
                {
                    console.log("The hash matches, but the titles don't! INVESTIGATE", ob.title, paperTitleDictionary[temphash].title, temphash, ob.hash);
                }
            }
        }
    }

    window.interactionHyperEdges = [];
    for(var ob in paperTitleDictionary)
    {
        if(paperTitleDictionary[ob].authors.length==1)
            delete paperTitleDictionary[ob];
        else
        {
            window.interactionHyperEdges.push(paperTitleDictionary[ob])
        }
    }

    

    // timestep_yearsarray_dict
    var timestep_label_dict = {};
    for (var timestep in timestep_yearsarray_dict)
    {
        // var minYear = 9999;
        // var maxYear = -1;
        timestep_label_dict[timestep] = d3.min(timestep_yearsarray_dict[timestep]) + "-"+d3.max(timestep_yearsarray_dict[timestep]);
    }

    // makestring
    var rowHeader=[];
    if(groupConferences)
        rowHeader = Object.keys(domain_conf_dict);
    else
        rowHeader = selectedConferences;

    // var rowHeader = Object.keys(conf_domain_dict);
    var stringData = [];
    for(var year in filteredDataOfConferences)
    {
        // var stringTime="\"" + year + "\":";
        var stringArray = [[""]];
        var stringDictionary = {};
        for(var rowLabel of rowHeader)
        {
            stringArray.push([rowLabel+""]);
        }
        for(var author in filteredDataOfConferences[year])
        {
            stringArray[0] += ","+author;
            for(var i=1; i<stringArray.length; i++)
            {
                // console.log(filteredDataOfConferences[year][author][rowHeader[i-1]]);
                if(rowHeader[i-1] in filteredDataOfConferences[year][author])
                    stringArray[i] += ","+filteredDataOfConferences[year][author][rowHeader[i-1]].count;
                else
                stringArray[i] += ",0";
            }
        }
        var concatenatedString ="";

        for(var i=0; i<stringArray.length; i++)
        {
            stringArray[i] += "&&&";
            concatenatedString += stringArray[i];
        }
        stringDictionary[timestep_label_dict[year]] = concatenatedString;
        stringData.push(stringDictionary);
    }
    // console.log(rowHeader, filteredDataOfConferences);

    console.log(JSON.stringify(interactionHyperEdges));
    console.log(JSON.stringify(stringData));
    window.paperInformation = filteredDataOfConferences;

    window.rowHeaders = rowHeader;
    // console.log(JSON.stringify(window.paperInformation));
    // console.log(JSON.stringify(window.timeStepsInfo));
    // console.log(JSON.stringify(window.rowHeaders));

    // console.log(JSON.stringify(authorInfo));
    // console.log(JSON.stringify(Object.keys(institutionsDictionary)));

    window.interactionHyperEdges = interactionHyperEdges;
    window.datasets["csresearch"]["data"] = stringData;
    datasetSelection.init();

    return stringData;



}

function listOfPapers(selectedVersions, author)
{
    var resultArray={};
    for(var setname of window.rowHeaders)
    {
        resultArray[setname]=[];
    }
    var timestepsArray = [];
    for(var i=0; i<window.selectedVersions.length; i++ )
    {
        // if( ((Math.pow(2,i)& selectedVersions) >0 ) || Math.pow(2,i) == selectedVersions)
        timestepsArray.push(Math.log2(window.selectedVersions[i])+1);
    }
    // console.log(timestepsArray);
    for(var timestep of timestepsArray)
    {
        for(var setname of window.rowHeaders)
        {
            if(author in window.paperInformation[timestep])
                resultArray[setname] = resultArray[setname].concat(window.paperInformation[timestep][author][setname].papers);
        }
    }
    for(var setname in resultArray)
    {
        if(resultArray[setname].length ==0)
            delete resultArray[setname];
        else
            resultArray[setname].sort(function(a,b){
                return a.year - b.year;
            })
    }

    // console.log(resultArray);
    d3.select("#paperList").selectAll("*").remove();
    var container = d3.select("#paperList");
    for(var setname in resultArray)
    {
        var setContainer = d3.select("#paperList").append("div");
        setContainer.append("h6").text(setname);
        var list = setContainer.append("ol");
        for(var d of resultArray[setname])
        {
            // row.append("tspan").text(function(d,i){
            //     return i+". ";
            // });
            var row = list.append("li");
            row.append("tspan").text(function(){
                return "\""+d.title + "\", ";
            });
            row.append("tspan").text(function(){
                return d.area + ", ";
            });
            row.append("tspan").text(function(){
                return d.year + " ";
            });
        }
    }
    document.getElementById('paperInfo').style.display='block';
}
function hash(s)
{
    var nHash = 0;
    if (!s.length) return nHash;
    for (var i = 0, imax = s.length, n; i < imax; ++i)
    {
        n = s.charCodeAt(i);
        nHash = ((nHash << 5) - nHash) + n;
        nHash = nHash & nHash; // Convert to 32-bit integer
    }
    return Math.abs(nHash);
}