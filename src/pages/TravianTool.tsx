import React from 'react'
import app from '../firebase';
import InsertDataModal from './InsertDataModal';
import withAuth from '../contexts/withAuth';



type MyProps = {
    // using `interface` is also ok
    auth: any;
};

type MyState = {
    files: [string,string[][]][]; // like this
    mergedFile: string[][],
    report : string [][],
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
        files : [],
        mergedFile : [],
        report : [],
    };

    componentDidMount() {
        var dbRef = app.database().ref('ratingLite/leagues');
        dbRef.on('value', (snapshot: any) => {
            const data = snapshot.val();

            this.setState({
                
            })
        });
    }

    parseAuctionData(input: string, time: number, daysAgo: number): Transaction[]  {
        let strs = input.split('\n')
        
        strs = strs.filter((str) => str.startsWith("\u202d")) //keep rows starting with "\u202d"
        
        strs =  strs.map((str) => str.replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, " ")) //remove invisible characters
        const dat = strs.map((str) => {
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
            console.log(tr)
            
        })
        return [] //['', '', '1', '×', '', 'Small', 'Horn', 'of', 'the', 'Natarian', '4', '207', 'finished', 'outbid']
    }

    handleInsertData(data: string, time: number, daysAgo: number) { //should return promise
        //parse data
        
        let auctions = this.parseAuctionData(data, time, daysAgo)
        console.log(auctions)
        //insert data into db
        
        const { auth } = this.props;
        console.log(auth.currentUser)
        let dbRef = app.database().ref(auth.currentUser.uid + '')


        //return promise from db
    }

    render() {

        return (
            <div>
                <div className="row" style={{
                    margin: 0
                }}>
                    <div className="col-sm-4" style={{}}></div>
                    <div className="col-sm-4" style={{ textAlign: "left", backgroundColor: "white" }}>
                        <h2 className="mt-3" style={{ textAlign: "center" }}>Travian Auction Statistics</h2> 
                        
                        <button data-toggle="modal" data-target="#modalInsertDataForm" className="btn btn-primary mt-3" >Insert Data</button>
			            
                        
                        
                    </div>
                    <div className="col-sm-4"></div>
                </div>
                <InsertDataModal handleData={this.handleInsertData}></InsertDataModal>
			    
		    </div>
        );
    }
}

export default withAuth(TravianTool);