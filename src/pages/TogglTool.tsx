import React from 'react'
import { CSVLink, CSVDownload } from "react-csv";

type MyProps = {
    // using `interface` is also ok
    message: string;
};

type MyState = {
    files: [string,TimeEntry[]][]; // like this
    mergedFile: string[][]
};

type TimeEntry = { //TODO: I should probably optimize away this and replace with just string[], unless that makes dynamic columns really hard
    user: string;
    email: string;
    client: string;
    project: string;
    task: string;
    description: string;
    billable: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    duration: string;
    tags: string;
    amount: string;
}

class TogglTool extends React.Component<MyProps, MyState> {
    constructor(props : MyProps) {
        super(props);
        
        this.setFile = this.setFile.bind(this)
        this.createMergedFile = this.createMergedFile.bind(this)

    }
    state: MyState = {
        files : [],
        mergedFile : []
    };

    setFile(e : any) {
        Array.from(e.target.files).forEach((file) => {
            let currentFile = file as File;
            let fileReader : FileReader = new FileReader();
            fileReader.onload = (e : ProgressEvent) => {
                //Here is where you do stuff
                let result: string = fileReader.result as string
                let rows : string[] = result.split('\n')
                rows.pop(); // last element is allways empty row
                let data : TimeEntry[] = []
                data = Array.from(new Set(rows)) //make unique
                .map((row : string) => {
                    return this.createTimeEntry(row);
                })
                let header = data[0]; //TODO: this row should probably be used to dynamically set fields according to label
                data = data.slice(1)
                this.setState((state) => {
                    return {
                        files: [...state.files, [currentFile.name,data]]
                    }
                })
            }
            fileReader.readAsText(currentFile)
        })
        //fileReader.readAsText(e.target.files[0])
    }

    createMergedFile() {
        let set : Set<string> = new Set()
        Array.from(this.state.files).forEach((file) => {
            file[1].forEach((entry: TimeEntry) => {
                set.add(JSON.stringify(entry)); //cant find a better way to remove duplicates unfortunately
            })
        })
        let uniqueEntries = Array.from(set)
        let data = uniqueEntries.map((entryString: string) => {
            
            let entry : TimeEntry = (JSON.parse(entryString) as TimeEntry)
            return [
                entry.user,
                entry.email,
                entry.client,
                entry.task,
                entry.description,
                entry.billable,
                entry.startDate,
                entry.startTime,
                entry.endDate,
                entry.endTime,
                entry.duration,
                entry.tags,
                entry.amount,
                entry.project
            ]
        })
        this.setState({
            mergedFile: data
        })
    }

    createTimeEntry(text: string) : TimeEntry {
        //this might be a waste of time
        let fields: string[] = text.split(',');
        return {
            user: fields[0],
            email: fields[1],
            client: fields[2],
            task: fields[3],
            description: fields[4],
            billable: fields[5],
            startDate: fields[6],
            startTime: fields[7],
            endDate: fields[8],
            endTime: fields[9],
            duration: fields[10],
            tags: fields[11],
            amount: fields[12],
            project: fields[13],
        }
    }

    render() {
        return (
            <div>
                <div className="row" style={{
                    margin: 0
                }}>
                    <div className="col-sm-3" style={{}}></div>
                    <div className="col-sm-6" style={{ textAlign: "left", backgroundColor: "white" }}>
                        <h2 className="mt-3" style={{ textAlign: "center" }}>Toggl Tool</h2> 
                        
                        <input type="file" id="file-upload-input" name="file" onChange={this.setFile} multiple hidden/>
                        <label className="btn btn-primary mt-3" htmlFor="file-upload-input">Choose File</label>
			            
                        <ul className="list-group">
                            {this.state.files.map((file) => {
                                return <li className="list-group-item">{file[0]}</li>
                            })}

                        </ul>
                        { this.state.files.length > 0  //if there are files, display what you can do
                            ?
                            <div className="mt-3" >
                                <button type="submit" className="btn btn-primary" onClick={this.createMergedFile}>Download Merged</button>
                                <button type="submit" className="btn btn-primary ml-3">Convert to Report</button>
                            </div>
                            : <></>
                        }
                        
                        {
                            this.state.mergedFile.length > 0 ? 
                            <CSVLink data={this.state.mergedFile} enclosingCharacter=''>Download me</CSVLink>
                            : <></>
                        }
                    </div>
                    <div className="col-sm-3"></div>
                </div>
			    
		    </div>
        );
    }
}

export default TogglTool;