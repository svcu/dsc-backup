# DSC-BACKUP

DSC-BACKUP is a descentralized backup library. DSC-BACKUP conects to a server running DSC-BACKUP-GENESIS, this server is called genesis node, when you post data to your applicattion you are storing the data in localStorage, sending the data to the genesis node and the genesis node is sending the data to the backup nodes. When you search data, is searched in localStorage first and if that data not exists in localStorage is searched in the genesis node or backup nodes. With DSC-BACKUP you save your data preventing it to be lost


# Initializing dsc-backup

``` js
const dsc = require("dsc-backup");
const DSC = new dsc("YOUR GENESIS NODE ADDRESS");

DSC.register("YOUR IP ADDRESS") //It will return an access token
```

# Posting Data
    
```js

const accessToken = "YOUR ACCESS TOKEN"

const data = {
    "label" : "THE LABEL OF YOUR DATA (DATA NAME TO SEARCH IT LATER)",
    "access" : "OPEN OR CLOSED" //Open: everyone can access, Closed: only apps with your token can access,
    "type" : "CATEGORY OF THE DATA",
    "data" : { //Data goes here
        "name" : "John",
        "age" : "33",
        "token" : "THIS IS ONLY DATA FOR YOU TO FILTER IN THE ARRAY, CAN BE TOKEN OR CREATOR OR APP OR WHAT DO YOU WANT"
    }
}

DSC.set(data, accessToken)
```

# Geting Data
### This will return an array of JSON objects with the label you requested
### Get Data

```js
DSC.get("LABEL", "ACCESS TOKEN")
```

# Example
# Post
```js
const accessToken = "YOUR ACCESS TOKEN"

const data = {
    "label" : "Jhon",
    "access" : "Closed" 
    "type" : "user",
    "data" : { 
        "name" : "John",
        "age" : "33",
        "token" : "33fg78"
    }
}

DSC.set(data, accesToken)
```

# Get
```js
const accessToken = "YOUR ACCESS TOKEN"
DSC.get("Jhon", accesToken)
```

## Response
```json
[
    {
         "name" : "John",
         "age" : "33",
         "token" : "33fg78"
    },
     {
         "name" : "John",
         "age" : "35",
         "token" : "6x7788"
    }
]
```

# Learn how to create genesis node

## DSC-BACKUP-GENESIS Github page

https://github.com/svcu/dsc-backup-genesis
