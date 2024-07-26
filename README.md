# About
This site is meant to be a one-stop shop for recent flora and fauna observations in Griffith Park. It draws data from two sources: eBird and iNaturalist.

A live demo can be found [here](https://griffith-ad4288b76856.herokuapp.com/).

# Current Version

## ind_script.js
The ind_script.js file calls the eBird API for each of the top hotspots in Griffith Park. It calls the iNaturalist API once, since unlike with eBird, data for the whole park is readily accessible in a single call.

Note that the eBird API call requires an eBird API key, which I don't publish to GitHub. ind_script.js uses the variable `ebird_TOKEN` which is defined in a file called "api_keys.js".

The two APIs present similar data in different formats. For efficiency, I've defined the `Observation` class, which contains common name, scientific name, taxonomic category, location, and time data for each observation. These properties are common to both data formats, but they also have some distinguishing features. So, I've also defined the subclasses `iNatObs` and `eBirdObs.`

The script fetches the data, then calls the `addToObsiNat` and `addToObseBird` functions, which build an array of Observations.

Then, the `displayObs` function is called to write the Observations to the page. This function calls the `get_Icon` function, which returns the appropriate Font Awesome icon for an obervation, depending on its taxonomic category.

The `mapUpdate` function uses a Google Maps API key stored in the file "api_keys.js" to update the map with new coordinates associated with the Observations.

## index.html

The index.html page is formatted using the Bootstrap 5.3.3 library, with icons from Font Awesome.

# The next version (in progress).

The plan for the next version of the site is to move to a Node / MongoDB / React framework in order to make the API calls on the backend, store data in a database, and add more functionality and data visualization on the front end.
