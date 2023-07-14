import React, { Component } from 'react'
import './RatingLite.css'
import firebase from "firebase/app";
import 'firebase/database';
import { Link, Route, Switch } from 'react-router-dom'
import database from '../firebase';


const db = database

export class RatingLite extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddLeagueElement: false,
            leagues: [],
        }

        this.updateLeague = this.updateLeague.bind(this);
        this.updateNewLeagueName = this.updateNewLeagueName.bind(this);
    }
    
    updateNewLeagueName(e) {
        this.setState({
            newLeagueName: e.target.value
        })
    }

    updateLeague(e) {
        this.setState({
            league: e.target.value
        })
    }

    showAddLeague() {
        this.setState({
            showAddLeagueElement: true
        })
    }

    addNewLeague() {
        const usedIds = Object.values(this.state.leagues).map((obj) => obj.id)
        const newId = this.state.newLeagueName.replace(' ', '_').toLowerCase();
        if (newId === "") {
            return;
        }
        if (usedIds.includes(newId)) {
            alert("Grattis, du hittade en bug. Klappa dig själv på axeln och gråt för jag tänker inte fixa det här edge-caset.")
            return;
        } else {
            firebase.database().ref('ratingLite/leagues').push({
                id: newId,
                name: this.state.newLeagueName
            }).catch(e => {
                console.error(e);
                alert("Database error: " + e)
            })
        }
        this.props.history.push("/ratingLite/" + newId)
        
    }

    componentDidMount() {
        var dbRef = db.ref('ratingLite/leagues');
        dbRef.on('value', (snapshot) => {
            const data = snapshot.val();

            this.setState({
                leagues: data
            })
        });
    }

    render() {
        return (
            <>
                <div className="row" style={{
                    margin: 0
                }}>
                    <div className="col-sm-3" style={{}}></div>

                    <div className="col-sm-6" style={{ textAlign: "left", backgroundColor: "white" }}>
                        {/* Select League */}
                        <div className="btn-group mt-3">
                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Select League
                            </button>
                            <div className="dropdown-menu">
                                {Object.values(this.state.leagues).map(league => (
                                    <Link key={league.id} className="dropdown-item" to={"/ratingLite/" + league.id} >{league.name}</Link>
                                ))}
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="/#" onClick={() => this.showAddLeague()} >Add new league</a>
                            </div>
                        </div>
                        { this.state.showAddLeagueElement
                            ? 
                            <div className="input-group mt-3">
                                <input type="text" className="form-control" placeholder="League Name" aria-label="League Name" aria-describedby="basic-addon2" value={this.state.newLeagueName} onChange={this.updateNewLeagueName} />
                                <div className="input-group-append">
                                    <button onClick={() => this.addNewLeague()} className="btn btn-outline-secondary" type="button" >Add</button>
                                </div>
                            </div>
                            : <></>
                        }
                        
                        <Switch>
                            {
                                // The example for react router v4 helped
                                // https://ui.dev/react-router-pass-props-to-components/
                            }
                            <Route path={this.props.match.path + "/:leagueId"} render={(props) => <League {...props} leagues={this.state.leagues} />}></Route> 
                        </Switch>
                    </div>
                    <div className="col-sm-3"></div>
                </div>
            </>
        )
    }
}

class League extends Component {

    constructor(props) {
        super(props);
        //find out where to find LeagueId
        this.state = {
            winner: "",
            loser: "",
            games: undefined,
        }

        this.submitGame = this.submitGame.bind(this);
        this.updateWinner = this.updateWinner.bind(this);
        this.updateLoser = this.updateLoser.bind(this);
    }

    submitGame(e) {
        e.preventDefault();

        firebase.database().ref('ratingLite/games/' + this.props.match.params.leagueId).push({
            //this.state.league
            winner: this.state.winner,
            loser: this.state.loser,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            valid: true
        });
    }

    updateWinner(e) {
        if (e.target.value==="state") console.log(this.state)
        if (e.target.value==="params") console.log(this.props.match.params)
        if (e.target.value==="props") console.log(this.props)
        this.setState({
            winner: e.target.value
        })
    }

    updateLoser(e) {
        this.setState({
            loser: e.target.value
        })
    }

    componentDidMount() {
        this.dbRef = db.ref('ratingLite/games/' + this.props.match.params.leagueId);
            this.dbRef.on('value', (snapshot) => {
                const data = snapshot.val();
                this.setState({
                    games: data,
                })
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.leagueId !== this.props.match.params.leagueId) {
            // if new leagueId, unsubscribe from last one and subscribe to new one
            if (this.dbRef) this.dbRef.off();
            this.dbRef = db.ref('ratingLite/games/' + this.props.match.params.leagueId);
            this.dbRef.on('value', (snapshot) => {
                const data = snapshot.val();
                this.setState({
                    games: data,
                })
            });
        }
    }

    render() {
        let games = this.state.games ? Object.values(this.state.games) : [];

        let map = {}
        games.forEach((game) => {
            let winnerElo = map[game.winner] ? map[game.winner] : 1200;
            let loserElo = map[game.loser] ? map[game.loser] : 1200;

            var expectedA = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));

            var kValue = 40;
            var ratingChange = Math.round(kValue * (1 - expectedA));

            map[game.winner] = winnerElo + ratingChange;
            map[game.loser] = loserElo - ratingChange;
        })
        let players = Object.entries(map).sort((a, b) => b[1] - a[1]);

        return (
            <>
                <h2 className="mt-3" style={{ textAlign: "center" }}>League: {
                    Object.values(this.props.leagues).filter((obj) => obj.id === this.props.match.params.leagueId )[0]?.name
                }</h2> 
                <form className="gameForm" onSubmit={this.submitGame}>
                    <div className="form-group">
                        <label htmlFor="inputWinner">Winner</label>
                        <input required type="text" className="form-control" id="inputWinner" placeholder="Winner"
                            value={this.state.winner} onChange={this.updateWinner} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputLoser">Loser</label>
                        <input required type="text" className="form-control" id="inputLoser" placeholder="Loser"
                            value={this.state.loser} onChange={this.updateLoser} />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

                <div className="gameList" style={{ textAlign: "center" }}>
                    <h2 >Players</h2>
                    {players.map(player => (
                        <div key={player[0]}>
                            <div>
                                <div className="row">

                                    <div className="col-6" style={{ textAlign: "left" }} >{player[0]}</div>
                                    <div className="col-6" style={{ textAlign: "right" }} >{player[1]}</div>


                                </div>
                                <hr />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="gameList" style={{ textAlign: "center" }}>
                    <h2 >Game History</h2>
                    {games.map(game => (
                        <div key={game.timestamp}>
                            <div>
                                <div className="row">
                                    <div className="col-6" style={{ textAlign: "left" }} >{game.winner}</div>
                                    <div className="col-6" style={{ textAlign: "right" }} >{game.loser}</div>
                                </div>
                                <hr />
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )
    }
}

export default RatingLite
