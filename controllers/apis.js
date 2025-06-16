const asyncHandler = require("express-async-handler");
const axios = require("axios");
const https = require("https");
const { addDoc, getDocs } = require('firebase/firestore');
const { Apis, queryRef } = require('../config/firebase.js');

const create_api = asyncHandler( async (req, res) => {
    try {
        const { clientUid, apiKey, scrtKey } = req.body
        console.log({ clientUid, apiKey, scrtKey })

        if (!clientUid || !apiKey || !scrtKey) {
          res.status(400).json({ type: 'error', message: 'Input fields are invalid' })
          return
        }

        const apis = await getDocs(queryRef("apis", "uid", uid));

        if (!apis.empty) {
            res.status(400).json({ type: 'error', message: 'API already present' })
            return
        }

        await addDoc(Apis, { uid: clientUid, apiKey, scrtKey }).then(()=>{
          res.status(200).json({ type: 'success', message: 'API added successfully' })
        }).catch((error)=>{
          console.log(error)
          res.status(200).json({ type: 'error', message: 'Failed to add new API' })
        })
    } catch (error) {
      console.error(error)
    }
})

const check_balance = asyncHandler( async(req, res) => {
    try {
        const { uid } = req.params;

        const apis = await getDocs(queryRef("apis", "uid", uid));

        if (!apis.empty) {
            const keys = apis.docs[0].data();
            // console.log(keys);
        
            await axios.request({
                url: "https://apisms.beem.africa/public/v1/vendors/balance",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + Buffer.from(keys.apiKey + ":" + keys.scrtKey)
                    .toString("base64"),
                },
                httpsAgent: new https.Agent({
                  rejectUnauthorized: false,
                })
            })
            .then((response) => {
                // console.log({response});
                res.json({
                    type: "success",
                    creditBalance: response.data.data.credit_balance
                })
            })
            .catch((error) => {
                // console.error({error});
                res.json({
                    type: "error",
                    message: error.message
                })
            });
            return
        }

        res.json({ type: 'error', message: 'API keys not found' })
    } catch (error) {
        console.error(error);
    }
} );

module.exports = {
    create_api,
    check_balance,
};