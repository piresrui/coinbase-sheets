/**
 * Returns price from coinbase
 *
 * @param {"currency_pair"} CoinbaseKey Format is BASECURRENCY-EXCHANGECURRENCY (e.g. BTC-USD)
 * @return The current price
 * @customfunction
 */
function COINBASEFETCH(currency_pair) {
    
    var currency_pair = currency_pair || "BTC-USD"
  
    var data = {}
    let key = "CBF_" + currency_pair
    let cache = CacheService.getUserCache()

    var cached = cache.get(key);
    if (cached && cached.length > 1) {
        data = JSON.parse(cached)

        return parseFloat(data["data"]["amount"])
    }

    try {
            
        let url = "https://api.coinbase.com/v2/prices/" + currency_pair + "/buy"

        let response = UrlFetchApp.fetch(url)            
        data = JSON.parse(response.getContentText());
        
        if( data["errors"] ) {
            throw new Error(data["errors"])
        }

        if( response.getResponseCode() == 200 && data.length > 1 && data.length < 9000 ) {
            cache.put(CACHE_KEY, response.getContentText(), 90)
        }

        return parseFloat(data["data"]["amount"])


    } catch (error) {
        throw new Error(error.message) 
    }

}