import React from 'react'

type MyProps = {
    // using `interface` is also ok
    message: string;
};

type MyState = {
    games: [],
    puuid: String
};

type Resp = {
    // using `interface` is also ok
    setHeader: () => void;
};


class LolScore extends React.Component<MyProps, MyState> {
    constructor(props : MyProps) {
        super(props);
        
        this.fetchData = this.fetchData.bind(this)
        this.fetchCSGOData = this.fetchCSGOData.bind(this)

        


    }
    state: MyState = {
        games : [],
        puuid : ""
    };

    doFetch(url : RequestInfo) : Promise<Response> {
        return fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9,sv-SE;q=0.8,sv;q=0.7",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://developer.riotgames.com",
                "X-Riot-Token": "RGAPI-df556809-4250-43dc-85ee-7cba696fd8a6"
            }
        })
    }
        

    fetchData() {
        
        this.doFetch('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/FabbiX') 
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            this.doFetch('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/' + data.puuid + '/ids')
            .then((response) => {
                console.log(response)
                response.json()
                .then((data) => console.log(data));
            })
            
        })
    }

    fetchCSGOData() {
        
        this.doFetch('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/FabbiX') 
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            this.doFetch('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/' + data.puuid + '/ids')
            .then((response) => {
                console.log(response)
                response.json()
                .then((data) => console.log(data));
            })
            
        })
    }


    render() {
        return (
            <div>
                
			    <button type="submit" className="btn btn-primary" onClick={this.fetchData}>Fetch data</button>
                <button type="submit" className="btn btn-primary" onClick={this.fetchCSGOData}>Fetch data</button>
		    </div>
        );
    }
}

export default LolScore;