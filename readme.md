
# P2P : DUPLICATION FIXER

 1. Start by running `npm i`
 2. Run `node init.js`
 3. Run `node index --env=<env> --type= 'agencies' | 'companies' (default is 'companies') --attr= <attr> (default is 'name') `

## NOTICE : 
### Make sure you put all of your `csv` files in the input directory !!! 
### All the processed `json` files will be written in the output directory !!! 
### The available environments are :
 - #### dev
 - #### preprod
 - #### prod

### The available types are :
 - #### companies
 - #### agencies
#### Default is "companies"
### The available attr are :
 - #### all source object attributes
#### Default is "name"

### You can specify 'all' in order to parse all the env files