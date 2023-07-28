import React from 'react'
import app from '../firebase';
import InsertDataModal from './InsertDataModal';
import withAuth from '../contexts/withAuth';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom'
import TravianToolChart from '../components/TravianToolChart';
import DataTable from '../components/DataTable';



type MyProps = {
    // using `interface` is also ok
    auth: any;
};

type MyState = {
    server: string;
    servers: string[];
    showAddServerElement: boolean;
    searchQuery: string;
    items: Set<string>;
    showResults: boolean;
    item: string;
    data: ServerData | null;
    newServerName: string;
    dayData: {x: number, y: number}[];
    recentDayData: {x: number, y: number}[];
    recentNumOfDays: number;
    sortedFilteredTransactions: Transaction[]
};

type Transaction = {
    quantity: number;
    item: string;
    bids: number;
    price: number;
    timeStamp: number; //used for date only
    time: number; //between 00 and 23, or -1 for non existant
};

interface ServerData {
    [serverName: string]: {
      [transactionId: string]: Transaction;
    };
  }
  

class TravianTool extends React.Component<MyProps, MyState> {
    constructor(props : MyProps) {
        super(props);
        this.handleInsertData=this.handleInsertData.bind(this);
        


    }
    state: MyState = {
        server : "",
        servers : [],
        showAddServerElement: false,
        searchQuery: "",
        items: new Set(),
        showResults: false,
        item: "",
        data: null, //this.state.data?[server] <- in here be transactions
        newServerName: "",
        dayData: [],
        recentDayData: [],
        recentNumOfDays: 0,
        sortedFilteredTransactions: [],
    };
    private databaseRef : firebase.database.Reference | null = null;
    blurTimeout: NodeJS.Timeout | null = null;

    componentDidMount() {
        const { auth } = this.props;
        this.updateDatabaseReference(auth.currentUser?.uid);
    }

    componentDidUpdate(prevProps: MyProps) {
        //it's important to have a break condition here, because updating state will call componentDidUpdate again
        if (prevProps.auth.currentUser !== this.props.auth.currentUser) {
            /*  
            We need this because we need the data to change whenever currentUser changes. 
            There might be a better way though
            */
            const { auth } = this.props;
            this.updateDatabaseReference(auth.currentUser?.uid);
        }
    }

    componentWillUnmount() {
        this.databaseRef?.off();
    }

    updateDatabaseReference(userId: string) {
        this.databaseRef?.off();
        this.databaseRef = app.database().ref(`travianTool/${userId}`); //TODO: path
        this.databaseRef.on('value', (snapshot) => {
            const data = snapshot.val()
            
            this.setState({ 
                
                data: data,
                servers: data ? Object.keys(data) : [],
                item: ""
             })   
        });
        this.setState({
            server: ""
        })
    }

    processData() {
        if (this.state.data) {
            Object.values(this.state.data[this.state.server])
        }

    }

    parseAuctionData(input: string, time: number, daysAgo: number): Transaction[]  {
        let strs = input.split('\n')
        
        strs = strs.filter((str) => str.startsWith("\u202d")) //keep rows starting with "\u202d"
        
        strs =  strs.map((str) => str.replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, " ")) //remove invisible characters
        const result : Transaction[] = strs.map((str) => {
            const splitString = str.split(' ')
            let date = new Date(Date.now());
            date.setDate(date.getDate() - daysAgo);
            
            const tr : Transaction = {
                quantity: +splitString[2],
                item: splitString.slice(5,splitString.length-4).join(" "),
                bids: +splitString[splitString.length - 4],
                price: +splitString[splitString.length - 3],
                timeStamp: date.valueOf(),
                time: time
            }
            return tr;
            
            
        })
        return result; 
    }

    handleInsertData(data: string, time: number, daysAgo: number) : Promise<(firebase.database.Reference | null)[]> {
        //parse data
        let auctions = this.parseAuctionData(data, time, daysAgo)
        
        let dbRef = this.databaseRef
        let promises : (firebase.database.ThenableReference | null)[] = auctions.map((auc) => {
            if (dbRef) {
                return dbRef.child(this.state.server).push(auc)
            } else {
                console.log("Warnign: this should never happen")
                return null
            }
        })
        return Promise.all(promises)

        //return promise from db
    }

    showAddServer() {
        this.setState({
            showAddServerElement: true
        })
    }

    setServer(server : string) {
        if (this.state.data && this.state.data[server]) {
            const transactionArray = Object.values(this.state.data[server])
            const items = new Set(transactionArray.map((tr) => tr.item))
            this.setState({
                server: server,
                items: items,
                item: ""
                
            })
        } else {
            this.setState({
                server: server, //should also empty items
            })
        }
        
    }

    handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value;
        this.setState({ 
            searchQuery,
        });
    };

    handleSearchBlur = () => {
        // Hide search results when the search bar loses focus
        // Needs timeout because otherwise it will remove the item before the onclick is executed
        this.blurTimeout = setTimeout(() => {
            this.setState({ showResults: false });
        }, 100);
    };

    handleSearchFocus = () => {
        // Show search results when the search bar is selected (focused)
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.setState({ showResults: true });
    };

    selectItem(item : string) {
        
        if (this.state.data) {
            const transactionArray = Object.values(this.state.data[this.state.server])
            const filteredTransactionArray = transactionArray.filter((tr : Transaction) => {
                return tr.item === item
            })
            const sortedFilteredTransactionArray = filteredTransactionArray.sort((tr1, tr2) => tr1.timeStamp - tr2.timeStamp)
            let minX = 0;
            const dayData = sortedFilteredTransactionArray.map((tr) => {
                let daysAgo = (Math.floor(((tr.timeStamp - Date.now())/86400000)+0.5));
                if (daysAgo < minX) minX = daysAgo;
                return {x: daysAgo, y: tr.price/tr.quantity}
            }).map((dp) => {
                return {x: dp.x-minX, y: dp.y}
            })

            const twentyPercent = minX*-0.8
            const threeDays = (minX*-1)-3
            const recentStartDay = Math.min(twentyPercent, threeDays)
            const recentTransaction = dayData.filter((tr) => {
                return tr.x >= recentStartDay
            })             
            
            this.setState({
                dayData: dayData,
                item: item,
                recentDayData: recentTransaction,
                recentNumOfDays: (minX*-1)-recentStartDay, 
                sortedFilteredTransactions: sortedFilteredTransactionArray
            })
        } else {
            this.setState({
                dayData: [],
                item: item,
                recentDayData: [],
                recentNumOfDays: 0
            })
        }


        
    }

    addNewServer(): void {
        this.setState((oldState) => {
            return {
                servers: [...oldState.servers, oldState.newServerName],
                showAddServerElement: false,
                newServerName: ""
            }
        })
    }

    handleNewServerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newServerName = event.target.value;
        this.setState({ 
            newServerName,
        });
    };

    render() {

        const { items, searchQuery, showResults, newServerName } = this.state;
        const { auth } = this.props;

        // Filter items based on the search query
        const filteredItems = [...items].filter((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const priceValues = this.state.dayData.map(dp => dp.y)
        const recentPriceValues = this.state.recentDayData.map(dp => dp.y)

        return (
            
            <div>
                <div className="row" style={{
                    margin: 0
                }}>
                    <div className="col-sm-4" style={{}}></div>
                    <div className="col-sm-4" style={{ textAlign: "left", backgroundColor: "white" }}>
                        {auth.currentUser ? <>
                            <h2 className="mt-3" style={{ textAlign: "center" }}>Travian Auction Statistics</h2>
                            <div className="btn-group mt-3">
                                <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Select Server
                                </button>
                                {auth.currentUser &&
                                    <div className="dropdown-menu">
                                        {Object.values(this.state.servers).map(server => (
                                            <Link onClick={() => this.setServer(server)} key={server} className="dropdown-item" to="#" >{server}</Link>
                                        ))}
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" onClick={() => this.showAddServer()} >Add new server</a>
                                    </div>}
                            </div>
                            {this.state.showAddServerElement && auth.currentUser
                                ?
                                <div className="input-group mt-3">
                                    <input type="text" className="form-control" placeholder="League Name" aria-label="League Name" aria-describedby="basic-addon2" value={newServerName} onChange={this.handleNewServerInputChange} />
                                    <div className="input-group-append">
                                        <button onClick={() => this.addNewServer()} className="btn btn-outline-secondary" type="button" >Add</button>
                                    </div>
                                </div>
                                : <></>
                            }
                            {this.state.server &&
                                <>
                                    <h3 className="mt-3" style={{ textAlign: "center" }}>Server: {this.state.server}</h3>
                                    <div>
                                        {/* Search bar */}
                                        <div className="form-group" style={{ marginBottom: '0' }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={this.handleSearchInputChange}
                                                onBlur={this.handleSearchBlur}
                                                onFocus={this.handleSearchFocus}
                                            />
                                        </div>

                                        {/* Display the search results */}
                                        {showResults && (
                                            <ul className="list-group">
                                                {filteredItems.map((item) => (
                                                    <li onClick={() => this.selectItem(item)} key={item} className="list-group-item">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {this.state.item &&
                                            <>
                                                <h2 className="mt-3" style={{ textAlign: "center" }}>{this.state.item}</h2>
                                                <TravianToolChart data={this.state.dayData} />
                                                <h3 className="mt-3" style={{ textAlign: "center" }}>Percentiles</h3>
                                                <DataTable columns={["10%", "20%", "30%", "40%", "Average"]} data={[
                                                    [
                                                        calculatePercentile(priceValues, 10).toFixed(2).toString(),
                                                        calculatePercentile(priceValues, 20).toFixed(2).toString(),
                                                        calculatePercentile(priceValues, 30).toFixed(2).toString(),
                                                        calculatePercentile(priceValues, 40).toFixed(2).toString(),
                                                        (priceValues.reduce((a, b) => a + b, 0) / priceValues.length).toFixed(2).toString()
                                                    ]
                                                ]} />
                                                <h3 className="mt-3" style={{ textAlign: "center" }}>Last {this.state.recentNumOfDays} days</h3>
                                                <DataTable columns={["10%", "20%", "30%", "40%", "Average"]} data={[
                                                    [
                                                        calculatePercentile(recentPriceValues, 10).toFixed(2).toString(),
                                                        calculatePercentile(recentPriceValues, 20).toFixed(2).toString(),
                                                        calculatePercentile(recentPriceValues, 30).toFixed(2).toString(),
                                                        calculatePercentile(recentPriceValues, 40).toFixed(2).toString(),
                                                        (recentPriceValues.reduce((a, b) => a + b, 0) / recentPriceValues.length).toFixed(2).toString()
                                                    ]
                                                ]} />

                                                <h3 className="mt-3" style={{ textAlign: "center" }}>Transactions</h3>
                                                <DataTable columns={["Quantity", "Name", "Bids", "Price", "Day", "Time"]} data={this.state.sortedFilteredTransactions.reverse().map((tr) => {
                                                    return [
                                                        tr.quantity.toString(), 
                                                        tr.item, 
                                                        tr.bids.toString(), 
                                                        tr.price.toString(), 
                                                        (Math.floor(((tr.timeStamp - Date.now())/86400000)+0.5)).toString(), 
                                                        tr.time.toString() 
                                                    ]
                                                })} />
                                                
                                            </>
                                        }

                                    </div>
                                    <div className="row" style={{
                                        margin: 0
                                    }}>
                                        <button data-toggle="modal" data-target="#modalInsertDataForm" className="btn btn-primary mt-3" >Insert Data</button>
                                    </div>
                                </>
                            }
                        </> : 
                        <h2 className="mt-3" style={{ textAlign: "center" }}>Log in to use this feature</h2>
                        }
                    </div>
                    <div className="col-sm-4"></div>
                </div>
                <InsertDataModal handleData={this.handleInsertData}></InsertDataModal>

            </div>
        );
    }
}

function calculatePercentile(data: number[], percentile: number): number {
    if (percentile <= 0 || percentile >= 100) {
        throw new Error('Percentile must be between 0 and 100.');
    }
    // Sort the data in ascending order
    const sortedData = data.slice().sort((a, b) => a - b); //optimization possible, no need to redo this every time

    // Calculate the rank
    const rank = (percentile / 100) * (sortedData.length - 1) + 1;

    // Check if the rank is an integer
    if (Number.isInteger(rank)) {
        // If rank is an integer, return the value at that rank
        return sortedData[rank - 1];
    } else {
        // If rank is not an integer, take the average of the values at ranks above and below
        const lowerRank = Math.floor(rank);
        const upperRank = Math.ceil(rank);
        const lowerValue = sortedData[lowerRank - 1];
        const upperValue = sortedData[upperRank - 1];
        return (lowerValue + upperValue) / 2;
    }
}

export default withAuth(TravianTool);