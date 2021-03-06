const rp = require("request-promise");
const http = require("http");
const crypto = require("crypto");
const isreachable = require("is-reachable");

let ls;
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    ls = new LocalStorage('./djs-info');
  }
//CLIENT

class DSC{
    

    constructor(genesisNode){
        this.genesisNode = genesisNode;
        this.data = [];
        this.nodes = ["http://localhost:3001"];
        this.tokens = [];
        this.backup = [];
    }

    async isOnline(host){
        let online = "offline";
        let hostFix1 = host.replace("http://", "")
        console.log(hostFix1)
        let hostFix2 = hostFix1.replace(":3000","")

       const is = await isreachable(host).catch(onRejected => console.log("rejected"));

       if(is){
           online="online"
       }

       /* const req = http.request({host: hostFix2, port: 3000, path: "/"}, (res)=>{
            online = "online";
            return true
        })

        req.on("error", (res)=>{
            return false
        })

        req.end();

      /*  await http.get({host: hostFix2, port:3000, path:"/"}, (res)=>{
            if(res.statusCode == 200 || res.statusCode){
                online = "online"
                return true
            }else{
                return false
            }
        })*/

        console.log("OL:", online)
        return online
    }

    //Get Data
    async get(label, tk, secret){

        let env;
        let state;
        
        await this.isOnline(this.genesisNode)
        .then(response => {
            state = "online"
        }).catch(
            state = "offline"
        );

        

        if(ls.getItem(label)){ //First search data in ls (Offline first)
            return ls.getItem(label)
        }else{ //If there is not data with the label requested in ls request it from genesisNode and storeIt in ls
            
            if(state == "online"){
                const options = {
                    uri: this.genesisNode+"/data",
                    method: "get",
                    json: true,
                    body:{
                        token: tk,
                        label: label,
                        secret: secret
                    }
                }
                console.log("OK")
                rp(options)
                .then(response => {
                    console.log(response);
                    this.data.push(response);
                   /* const decrypter = crypto.createDecipher("aes-256-gcm", secret)
                    env = decrypter.update(response, "hex", "utf8") + decrypter.final("utf8");
                    response = decrypter.update(response, "hex", "utf8") + decrypter.final("utf8");*/
                    ls.setItem(label, response);

                    env = response
                    return response;
                })

                return env
            }else if(status != "online" && this.nodes.length !=0){
                this.nodes.forEach(node => {
                    if(this.isOnline(node+"/")){
                        const options = {
                            uri: node+"/data",
                            method: "get",
                            json: true,
                            body:{
                                "token": tk,
                                "label": label,
                                "secret" : secret
                            }
                        }
                
                        rp(options)
                        .then(response => {
                            console.log(response);
                            this.data.push(response);
                           /* const decrypter = crypto.createDecipheriv("aes-256-gcm", secret)
                            env = decrypter.update(response, "hex", "utf8") + decrypter.final("utf8");
                            response = decrypter.update(response, "hex", "utf8") + decrypter.final("utf8");*/
                            ls.setItem(label, response);

                            return response;
                        })

                        return env
                    }
                })
            }else{
                return "NO NODE AVAIBLE TO MAKE THIS REQUEST, TRY LATER"
            }

          
        }
     
    }

    //Post Data
    async set(data, tk, secret){
        let  rt = "";
        let options;
        let state;
        
        await this.isOnline(this.genesisNode)
        .then(response => {
            state = "online"
        }).catch(
            state = "offline"
        );

        if( state == "online"){
            options = {
                uri: this.genesisNode+"/data",
                method: "post",
                json: true,
                body: {
                    "token" : tk,
                    "body" : data, 
                    "secret":secret
                }
            }
        }else{
            this.nodes.forEach(node => {
                if(this.isOnline(this.node)){
                    options = {
                        uri: node+"/data",
                        method: "post",
                        json: true,
                        body: {
                            "token" : tk,
                            "body" : data
                        }
                    }
                }
            })
        }

      

      await rp(options)
        .then(response=> {
            console.log(response);
            if(response == "OK"){
                ls.setItem(data.label, JSON.stringify(data)); //Save data in ls for offline use later
                this.data.push(data)
            }
           rt = response
        })

        return rt;
    }

    //Post node
    node(node){
        this.nodes.push(node)
        return "OK"

    }
    
    //Obtain backup nodes
    getBackups(tk){
        const options = {
            uri: this.genesisNode+"/backups",
            method: "get",
            json: true,
            body: {
                "token" : tk
            }
        }

        rp(options)
        .then(response => {
            console.log(response);
            if(response !== "INVALID TOKEN"){
                response.forEach(bc => {
                    this.nodes.push(bc)
                })

                return "OK";
            }else{
                return "INVALID TOKEN"
            }
        })
    } 

    //Register client
    async register(node){

        let token;

        const options = {
            uri: this.genesisNode+"/node",
            method: "post",
            json: true,
            body: {
                "node" : node
            }
        }

        await rp(options)
        .then(response => {
            console.log(response)
            token = response
        })

        this.getBackups(token);

        return token
    }
}


module.exports = DSC