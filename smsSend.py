import requests

URL = 'https://apisms.beem.africa/v1/send'

#replace below parameters
api_key = 'api_key>'
secret_key = '<secret_key>'
source_addr = '<source_addr>'

session = requests.Session()
session.auth = (api_key, secret_key)

response = session.post(URL, data={
            "source_addr": source_addr,
            "encoding": "0",
            "message": 'SMS Test from Python API',
            "recipients": [
                {
                  "recipient_id": 1,
                   "dest_addr": "255762265939"
                },
                {
                  "recipient_id": 2,
                  "dest_addr": "255767539919"
                }

            ]
})

print(response.json())
