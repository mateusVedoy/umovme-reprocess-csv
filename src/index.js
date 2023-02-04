const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const removeDuplicatesByKey = (key, file, reprocessFromStart, timeBetweenCalls) => {

    const results = [];
    const setActionId = new Set();
    const actionIdArr = [];
    let filteredActionIdArr = [];

    fs.createReadStream(`${file}`)
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', async () => {

        try {

            actionIdArr.push(...runThrowFile(results, key))

            filteredActionIdArr = actionIdArr.filter((val) => {
                const duplicatedActionId = setActionId.has(val.key);
                setActionId.add(val.key);
                return !duplicatedActionId
            }).map(val => val.actionId);
    
            let isOK = await buildRecursiveReprocessPolicy(filteredActionIdArr, reprocessFromStart, timeBetweenCalls);
    
            if(isOK == "OK"){
                console.log("Total de registros duplicados retirados: " + parseInt(results.length - filteredActionIdArr.length))
                generateFile('result', 'actionId-sent-to-reprocess', filteredActionIdArr.toString());
                console.log("arquivo gerado e requisições sendo realizadas. Aguarde!")
            }

        } catch (error) {
            console.log(error.message)
        }
    })
}

function generateFile(dir, fileName, arr) {
    fs.writeFile(`./src/files/${dir}/${fileName}.txt`, arr.toString(),  (err) => {
        if(err)
            console.log(err)
    })
}

function runThrowFile(arr, key){

    const actionIdArr = [];

    arr.forEach(element => {

        if(!element[`${key}`])
            throw Error(`Inexisting ${key} property on .csv`);

        actionIdArr.push({
            "key": element[`${key}`],
            "actionId": element["header.actionId"]
        })
    });

    return actionIdArr;
}

async function sendActionIdsToReprocess(arr, reprocessFromStart) {

    try {
        await axios.post('https://webhook.site/1132baba-235e-40c2-88a0-d538f184a2db', {
            "actionIds": [...arr],
            "reprocessFromStart": reprocessFromStart
        });
        return "OK";
    } catch (error) {
        generateFile('error', 'actionId-error', arr);
        throw Error(`Somenthing in request went wrong. Consult actionId-error file on error dir`)
    }
}

async function buildRecursiveReprocessPolicy(arr, reprocessFromStart, timeBetweenCalls) {

    let isOK;

    try {
        const arrLength = arr.length;

        if(arrLength <= 500)
            isOK = await sendActionIdsToReprocess(arr, reprocessFromStart)

        else{
            const firstFiveHundred = arr.slice(0,500);
            const remainingValues = arr.slice(500, arr.length);

            isOK = await sendActionIdsToReprocess(firstFiveHundred, reprocessFromStart);

            setTimeout(() => {
                buildRecursiveReprocessPolicy(remainingValues, reprocessFromStart, timeBetweenCalls);
            }, timeBetweenCalls);
        }

        return isOK;

    } catch (error) {
        throw error;
    }
}

module.exports = removeDuplicatesByKey;