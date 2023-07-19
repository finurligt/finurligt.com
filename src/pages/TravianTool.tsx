import React from 'react'
import app from '../firebase';
import InsertDataModal from './InsertDataModal';
import withAuth from '../contexts/withAuth';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom'



type MyProps = {
    // using `interface` is also ok
    auth: any;
};

type MyState = {
    server: string;
    servers: string[];
    showAddServerElement: boolean;
    searchQuery: string;
    items: string[];
    showResults: boolean;
    item: string
};

type Transaction = {
    quantity: number;
    item: string;
    bids: number;
    price: number;
    timeStamp: number; //used for date only
    time: number; //between 00 and 23, or -1 for non existant
};

class TravianTool extends React.Component<MyProps, MyState> {
    constructor(props : MyProps) {
        super(props);
        this.handleInsertData=this.handleInsertData.bind(this);
        


    }
    state: MyState = {
        server : "",
        servers : ["asdasd"],
        showAddServerElement: false,
        searchQuery: "",
        items: ["asd","test","test2"],
        showResults: false,
        item: ""
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
            const { auth } = this.props;
            this.updateDatabaseReference(auth.currentUser?.uid);
        }
    }

    componentWillUnmount() {
        this.databaseRef?.off();
    }

    updateDatabaseReference(userId: string) {
        console.log(this.state)
        this.databaseRef?.off();
        this.databaseRef = app.database().ref(`${userId}/${this.state.server}`); //TODO: path
        this.databaseRef.on('value', (snapshot) => {
            const data = snapshot.val();
            //this.setState({ data }); //TODO
        });
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

    handleInsertData(data: string, time: number, daysAgo: number) { //should return promise
        //parse data
        
        let auctions = this.parseAuctionData(data, time, daysAgo)
        console.log(auctions)
        //insert data into db
        
        const { auth } = this.props;
        console.log(auth.currentUser)
        let dbRef = app.database().ref(auth.currentUser.uid + '') //TODO no


        //return promise from db
    }

    showAddServer() {
        this.setState({
            showAddServerElement: true
        })
    }

    setServer(server : string) {
        this.setState({
            server: server
        })
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
        this.setState({
            item
        })
        console.log("selected ",item)
    }

    render() {

        const { items, searchQuery, showResults } = this.state;

        // Filter items based on the search query
        const filteredItems = items.filter((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            
            <div>
                <div className="row" style={{
                    margin: 0
                }}>
                    <div className="col-sm-4" style={{}}></div>
                    <div className="col-sm-4" style={{ textAlign: "left", backgroundColor: "white" }}>
                        <h2 className="mt-3" style={{ textAlign: "center" }}>Travian Auction Statistics</h2>
                        <div className="btn-group mt-3">
                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Select Server
                            </button>
                            <div className="dropdown-menu">
                                {Object.values(this.state.servers).map(server => (
                                    <Link onClick={() => this.setServer(server)} key={server} className="dropdown-item" to="#" >{server}</Link>
                                ))}
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" onClick={() => this.showAddServer()} >Add new server</a>
                            </div>
                        </div>
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
                            </div>
                                <div className="row" style={{
                                    margin: 0
                                }}>
                                    <button data-toggle="modal" data-target="#modalInsertDataForm" className="btn btn-primary mt-3" >Insert Data</button>
                                </div>
                            </>
                        }
                    </div>
                    <div className="col-sm-4"></div>
                </div>
                <InsertDataModal handleData={this.handleInsertData}></InsertDataModal>

            </div>
        );
    }
}

export default withAuth(TravianTool);