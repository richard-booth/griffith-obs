#ebird api stuff
import requests
import json

#ebird hotspots to pull recent observations
hotspots = ['L1041285', 'L3058433','L1622759','L380915','L2198410','L22937810','L823886','L16320572','L6528214']

#Get hotspot recent observations and write to file 'out.json'
def writeRecents(hotspots:list):
    #creat api_urls
    api_urls = ['https://api.ebird.org/v2/data/obs/'+hotspot+'/recent' for hotspot in hotspots]
    #initialize string to write to file
    data = ""
    #loop through hotspot codes
    for hotspot in hotspots:
        #create api url using hotspot code
        req_url = 'https://api.ebird.org/v2/data/obs/'+hotspot+'/recent'
        #get data
        response = requests.get(req_url, headers={'X-eBirdApiToken': 'h7ef2kl07ipp'})
        #create string of json data of response, with outer brackets removed
        append = json.dumps(response.json())[1:-1]
        #if response isn't empty, add it to total string to write
        if append != "":
            data+=","+append
    #remove extra initial comma, add outer brackets for whole list of observations
    data = "[" + data[1:]+"]"
    #write whole string to file
    with open('out.json', 'w') as f:    
        f.write(data)

#writeRecents(hotspots)

with open('out.json', 'r') as f:
    data = json.load(f)

print('Total recent observations:', len(data))
print('First ten species:\n')
for name in [obs['comName'] for obs in data[0:11]]:
    print(name)



