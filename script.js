var maps4 = ["Aosta", "Sovoy", "Italy", "Siberia", "Grassy", "Sunki", "Homestead", "Arid Cliffs",
"Syria", "Amazonas", "Prussian Hills", "Austrian Pinnies", "Pyrenees"]

var maps3 = ["Aosta", "Sovoy", "Salamanca", "Italy", "Siberia", "Grassy", "Sunki", "Homestead", "Arid Cliffs",
"Syria", "Amazonas", "Prussian Hills", "Austrian Pinnies", "Pyrenees", "Galicia"]

var maps2 = ["Aosta", "Sovoy", "Salamanca", "Italy", "Siberia", "Grassy", "Sunki", "Homestead", "Arid Cliffs",
"Syria", "Amazonas", "Prussian Hills", "Austrian Pinnies", "Pyrenees", "Galicia", "Pyramids", "Tabuk", "Spanish Lakeside"]

//Positioning very important for probability!!!
var nations = ["Aus", "Gb", "Ru", "Pru", "Den", "Por", "Otto", "Sp", "Fr", "Swe", "Nl"]

var mapPics = {
    "Aosta": "pics/aosta.jpg",
    "Sovoy": "pics/sovoy.jpg",
    "Salamanca" : "pics/salamanca.jpg",
    "Italy" : "pics/italy.jpg",
    "Siberia" : "pics/siberia.png",
    "Grassy" : "pics/grassy.jpg",
    "Sunki" : "pics/sunken.jpg",
    "Homestead" : "pics/homestead.jpg",
    "Arid Cliffs" : "pics/arid.jpg",
    "Syria" : "pics/syria.jpg",
    "Amazonas" : "pics/amazonas.jpg",
    "Prussian Hills" : "pics/prussian.jpg",
    "Austrian Pinnies" : "pics/austrian.jpg",
    "Pyrenees" : "pics/pyren.jpg",
    "Galicia" : "pics/galizia.jpg",
    "Pyramids" : "pics/pyramids.jpg",
    "Tabuk" : "pics/tabuk.jpg",
    "Spanish Lakeside" : "pics/spanish.jpg"
}

var balanceDic = {}

var balanceDicStand = {
    "Aus" : 1,
    "Gb" : 2,
    "Den" : 0,
    "Fr": 2,
    "Otto" : 2,
    "Por" : 1,
    "Pru" : 2,
    "Ru" : 1,
    "Sp" : 1,
    "Swe" : 1,
    "Nl" : 0
}

var balanceAdjust = {
    "Aosta" : {
       "Por" : 2,
    },
    "Grassy" : {
        "Swe" : 2,
    },
    "Syria" : {
        "Otto" : 2
    },
    "Pyrenees" : {
        "Ru" : 2
    },
    "Austrian Pinnies" : {
        "Ru" : 2
    }
}

var curPos = 6
var curid = "btn3"
var cwState = 1
var curidCw = "btnCwPart"
var maxSn = 8
var curidSn = "btnMNat8"
var balanceN = true
var curidBn = "btnBnOn"

var teamsLast = undefined


function handleBalanceNat(btn){
    let oldBtn = document.getElementById(curidBn)
    oldBtn.className = "btn"
    btn.className = "btnCur"
    curidBn = btn.id

    if(curidBn == "btnBnOff"){
        balanceN = false
    } else {
        balanceN = true
    }
    console.log(balanceN)
}


function handleCivilWar(btn) {
    let oldBtn = document.getElementById(curidCw)
    oldBtn.className = "btn"
    btn.className = "btnCur"
    curidCw = btn.id

    if(curidCw == "btnCwOn"){
        cwState = 0
    } else if(curidCw == "btnCwPart"){
        cwState = 1
    } else {
        cwState = 2
    }

    console.log(cwState)
}

function handleMaxSameNat(btn) {
    let oldBtn = document.getElementById(curidSn)
    oldBtn.className = "btn"
    btn.className = "btnCur"
    curidSn = btn.id


    if(curidSn == "btnMNat1"){
        maxSn = 1
    } else if(curidSn == "btnMNat2"){
        maxSn = 2
    } else if(curidSn == "btnMNat3"){
        maxSn = 3
    } else if(curidSn == "btnMNat4"){
        maxSn = 4
    } else {
        maxSn = 8
    }
}

/**
 * @description Createas two arrays of nations respecting the rules set ins settings
 * @param {int} l length of nation array
 * @returns {array} [[nations1],[nations2]]
 */
function getNations(l) {
    let nats = [[], []]
    let nTaken = {"Aus" : maxSn, "Gb": maxSn, "Den": maxSn, "Fr": maxSn, "Otto": maxSn,
    "Por": maxSn, "Pru": maxSn, "Ru": maxSn, "Sp": maxSn, "Swe": maxSn, "Nl": maxSn}
    let natList = nations.slice()

    //In case of balance nations on handle with special function
    if(balanceN){
        //console.log("STARTING HERE <----------")
        let res = bNatsBacktrack(nats, nTaken, natList, [0, 0], l)
        return res
    }

    for(let i = 0; i < l; i++){

        if(cwState == 0){
            let num = randInt(natList.length)
            nats[0].push(gNtakeNation(natList, nTaken, num))
            num = randInt(natList.length)
            nats[1].push(gNtakeNation(natList, nTaken, num))

        } else if(cwState == 2){
            nats[0].push(gNcheckAdd(nats[1], natList, nTaken))
            nats[1].push(gNcheckAdd(nats[0], natList, nTaken))

        } else {
            let num = randInt(natList.length)
            nats[0].push(gNtakeNation(natList, nTaken, num))
            while(true){
                let num = randInt(natList.length)
                let newNat = natList[num]
                if(nats[0][i] != newNat){
                    nats[1].push(gNtakeNation(natList, nTaken, num))
                    break
                }
            }
        }
    }

    return nats
}

/**
 * @description Special helper function creating balanced nation distribution using backtracking
 * @param {int} l length of nation array
 * @param {[int, int]} vals value numbers of summed up nations in the teams
 * @returns {array} [[nations1],[nations2]]
 */
function bNatsBacktrack(nats, nTaken, natList, vals, l) {
    if(l == 0) {
        if(vals[0] == vals[1]){
            // console.log(vals.slice())
            // console.log(nats[0].slice())
            // console.log(nats[1].slice())
            return nats
        }

        // console.log("no sol: ")
        // console.log(vals.slice())
        //console.log(nats[0].slice(), nats[1].slice())
        // console.log(nats[1].slice())
        return false
    }
    //console.log(l)
    
    let tried1 = [false, false, false]
    let ll = l - 1

    while(tried1.includes(false)){
        let [num1, c] = [-1, -1]
        let newNation1 = ""

        if(cwState == 0 || cwState == 1){
            [num1, c] = getRemainingTierNat(tried1, natList)
        } else if(cwState == 2){
            [num1, c] = grtNatWithCheck(tried1, natList, nats[1])
        }

        if(num1 <= -1){
            break
        }
        newNation1 = gNtakeNation(natList, nTaken, num1)
        nats[0].push(newNation1)
        vals[0] += c

        let tried2 = [false, false, false]
        while(tried2.includes(false)){
            let [num2, c2] = [-1, -1]
            let newNation2 = ""
            
            if(cwState == 0){
                [num2, c2] = getRemainingTierNat(tried2, natList)
            } else if(cwState == 1){
                [num2, c2] = grtNatWithCheck(tried2, natList, [newNation1])
            } else {
                [num2, c2] = grtNatWithCheck(tried2, natList, nats[0])
            }

            if(num2 <= -1){
                break
            }
            newNation2 = gNtakeNation(natList, nTaken, num2)
            nats[1].push(newNation2)
            vals[1] += c2

            let res = bNatsBacktrack(nats, nTaken, natList, vals, ll)
            if(res){
                return res
            }

            vals[1] -= c2
            nats[1].pop();
            gNreturnNation(natList, nTaken, newNation2)
        }

        vals[0] -= c
        nats[0].pop();
        gNreturnNation(natList, nTaken, newNation1)
    }

    return false
}


/**
 * @description same as getRemainingTierNat but cheks for nation not to be in checkL
 * POSITINING OF NATIONS IN @param natList IS VERY IMPORRTANT FOR PROBABILITY<-----
 * @param natList list of nations that cant be taken
 * @returns {[int, int]} nation position in array and its balance value
 */
function grtNatWithCheck(tier, natList, checkL) {
    let n = natList.length
    let num = randInt(n)
    let checker = 0
    //console.log("Looping? ")
    
    while(true){
        if(!tier[balanceDic[natList[num]]] && !checkL.includes(natList[num])){
            break
        }
        num = (num + 1) % n
        checker++

        if(checker == n){
            return [-1, -1]
        }
    }
    
    let c = balanceDic[natList[num]]
    tier[c] = true
    return [num, c]
}


/**
 * @description gets random nation position having a tier not beeing included
 * in the tier list and changes tier taken to true
 * POSITINING OF NATIONS IN @param natList IS VERY IMPORRTANT FOR PROBABILITY<-----
 * @returns {[int, int]} nation position in array and its balance value
 */
function getRemainingTierNat(tier, natList) {
    let n = natList.length
    let num = randInt(n)
    let checker = 0
    //console.log("Looping? ")
    
    while(tier[balanceDic[natList[num]]]){
        num = (num + 1) % n
        checker++

        if(checker == n){
            return [-1, -1]
        }
    }
    
    let c = balanceDic[natList[num]]
    tier[c] = true
    return [num, c]
}

/**
 * @description Reverses effect of gNtakeNation
 */
function gNreturnNation(natList, nTaken, nation){
    if(nTaken[nation] == 0){
        natList.push(nation)
    }

    nTaken[nation]++
}

/**
 * @description Adjust the dictionary with number of taken nations and removes nation from
 * natList if taken too aften.
 * (Values given need to be correct no ERROR handeling!!!)
 * @returns {string} nation name
 */
function gNtakeNation(natList, nTaken, num){
    res = natList[num]
    nTaken[res]--
    if(nTaken[res] == 0){
        natList.splice(num, 1)
    }

    return res
}

/**
 * @description Gets list of taken nations, and returns a random nation not included.
 * (Could lead to infinit loop with too few nations!!!)<----
 * @param {array} nat list of taken nations
 * @returns {string} nation name
 */
function gNcheckAdd(nat, natList, nTaken){
    while(true){
        let num = randInt(natList.length)
        newNat = natList[num]
        if(!nat.includes(newNat)){
            return gNtakeNation(natList, nTaken, num)
        }
    }
}

/**
 * @description Adjusts the balanceDic later used to balanceNations
 */
function adjustBalance(map){
    balanceDic = {...balanceDicStand}
    bA = balanceAdjust[map]

    if(bA){
        for(nat in bA){
            balanceDic[nat] = bA[nat]
        }
    }
}


function createGame(revange) {
    let pS = document.getElementById("pS")
    let cList = pS.children

    //Pick random map
    var map = ""
    if(curid == "btn1" || curid == "btn2"){
        num = randInt(maps2.length)
        map = maps2[num]
    } else if(curid == "btn3"){
        num = randInt(maps3.length)
        map = maps3[num]
    } else {
        num = randInt(maps4.length)
        map = maps4[num]
    }
    
    //adjust balanceDic to map, must be done before calling getNations()
    if(balanceN){
        adjustBalance(map)
    }

    teams = [[], []]

    if(revange && teamsLast){
        teams[0] = teamsLast[1]
        teams[1] = teamsLast[0]
    } else {
        //read player names from input
        n = cList.length
        players = []
        for(let i = 0; i < n; i++) {
            players.push(cList[i].value)
        }

        //generate random teams
        teams = [[], []]
        t = 0
        for(let i = 0; i < n; i++){
            let num = randInt(players.length)
        
            teams[t].push(players[num])
            players.splice(num, 1)
            t = (t + 1) % 2
        }
    }

    //save the teams in case of revange
    teamsLast = teams

    let str = "Team1: "
    let str2 = "<br>Team2: "
    lT = teams[0].length
    nats = getNations(lT)

    //Create player position and nation output
    for(let i = 0; i < lT; i++){
        // if(teams[0][i] == "cro"){
        //     str += teams[0][i] + " : " + "Den"
        // } else {
        //     str += teams[0][i] + " : " + nats[0][i]
        // }
        // if(teams[1][i] == "cro"){
        //     str2 += teams[1][i] + " : " + "Den"
        // } else {
        //     str2 += teams[1][i] + " : " + nats[1][i]
        // }
        str += teams[0][i] + " : " + nats[0][i]
        str2 += teams[1][i] + " : " + nats[1][i]
        if(i < lT - 1){
            str += " --|-- "
            str2 += " --|-- "
        }

        cList[i * 2].value = teams[0][i]
        cList[i * 2 + 1].value = teams[1][i]
        // cList[i * 2].style.backgroundColor = "rgba(158, 78, 75, 0.15)"
        // cList[i * 2 + 1].style.backgroundColor = "rgba(75, 122, 150, 0.15)"
    }
    str += str2
    

    //Map-Background animation
    let picUrl = mapPics[map]
    $('#showcase').fadeTo(300, 0.3, function()
    {
        $(this).css('background', 'url(' + picUrl + ') no-repeat center center/cover');
    }).fadeTo(300, 1);
    
    document.getElementById("teamsTxt").innerHTML = str
    document.getElementById("teamsTxt").style.fontSize = "30px"
    document.getElementsByClassName("showcase-content")[0].style.paddingTop = "86px"
    document.getElementById("mapTxt").innerHTML = "map is <span class=" + 
    "text-primary" + ">" + map + " </span>"
}


function sSize(btn) {
    let oldBtn = document.getElementById(curid)
    oldBtn.className = "btn"
    btn.className = "btnCur"
    curid = btn.id

    let pS = document.getElementById("pS")
    let cList = pS.children

    if(btn.id == "btn1"){
        removeEls(2, cList, pS)
    } else if(btn.id == "btn2") {
        removeEls(4, cList, pS)
    } else if(btn.id == "btn3") {
        removeEls(6, cList, pS)
    } else {
        removeEls(8, cList, pS)
    }
}


/**
 * @description removes or adds text-input fields according to selected size of game
 */
function removeEls(pos, c, pS) {
    if(pos < curPos){
        while(pos != curPos){
            c[c.length - 1].remove()
            curPos--
        }
    }
    
    if(pos > curPos){
        while(pos != curPos){
            var newC = document.createElement("INPUT")
            newC.setAttribute("type", "text")
            pS.appendChild(newC)
            curPos++
        }
    }
    
}


function randInt(max) {
    return Math.floor(Math.random() * max)
}
