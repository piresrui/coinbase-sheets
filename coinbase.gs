
/**
 * Returns price from coinbase
 *
 * @param {"currency_pair"} Currency Format is BASECURRENCY_EXCHANGECURRENCY (e.g. BTC-USD)
 * @return The current price
 * @customfunction
 */
function COINBASEFETCH(currency_pair) {
    
    var data = {}
    let key = "CBF_" + currency_pair
    let cache = CacheService.getUserCache()

    var cached = cache.get(CACHE_KEY);
    if (cached && cached.length > 1) {
      data = JSON.parse(cached)
    }

    try {
            
        let url = "https://api.coinbase.com/v2/prices/" + currency_pair + "/buy"

        let response = UrlFetchApp.fetch(url)            
        data = data = JSON.parse(response.getContentText());
        
        if( data["errors"] ) {
            throw new Error(data["errors"])
        }

        if( response.getResponseCode() == 200 && data.length > 1 && data.length < 9000 ) {
            cache.put(CACHE_KEY, response.getContentText(), 90)
        }

        return parseFloat(data["data"]["ammount"])


    } catch (error) {
        throw new Error(error.message) 
    }

}