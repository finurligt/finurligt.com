import React from 'react'
import { CSVLink, CSVDownload } from "react-csv";
import { Bar } from 'react-chartjs-2'

type MyProps = {
    // using `interface` is also ok
    message: string;
};

type MyState = {
    files: [string,string[][]][]; // like this
    mergedFile: string[][],
    report : string [][],
    chartData : {labels: string[], datasets: ChartData[]} | null,
};

type ChartData = {
    label: string;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
};

class TogglTool extends React.Component<MyProps, MyState> {
    constructor(props : MyProps) {
        super(props);
        
        this.setFile = this.setFile.bind(this)
        this.mergeFiles = this.mergeFiles.bind(this)
        this.makeReport = this.makeReport.bind(this)
        this.createMergedFile = this.createMergedFile.bind(this)
        this.makeChartData = this.makeChartData.bind(this);


    }
    state: MyState = {
        files : [],
        mergedFile : [],
        report : [],
        chartData : null
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
                let data : string[][] = []
                data = Array.from(new Set(rows)) //make unique
                .map((row : string) => {
                    return row.split(',');
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
    }

    createMergedFile() {
        let mergedData = this.mergeFiles()
        this.setState({
            mergedFile: mergedData
        })        
    }

    mergeFiles() : string[][] {
        let set : Set<string> = new Set()
        Array.from(this.state.files).forEach((file) => {
            file[1].forEach((entry: string[]) => {
                set.add(JSON.stringify(entry)); //cant find a better way to remove duplicates unfortunately
            })
        })
        let uniqueEntries = Array.from(set)
        let data = uniqueEntries.map((entryString: string) => {
            
            let entry : string[] = (JSON.parse(entryString) as string[])
            return entry;
        })
        return data;
    }

    makeReport() {
        let map = new Map<string, number>();
        let mergedFile = this.mergeFiles()
        mergedFile.forEach((row) => {
            let duration : [number,number,number] = row[11].split(':').map((str) => +str) as [number,number,number]
            let durationInseconds = duration[0] * 3600 + duration[1] * 60 + duration[2];
            if (map.has(row[3])) {
                map.set(row[3],map.get(row[3]) as number + durationInseconds)
            } else {
                map.set(row[3], durationInseconds)
            }
            let sortable : [string, number][] = []
            map.forEach((value, key) => {
                sortable.push([key,value])
            })
            sortable.sort((e1,e2) => {
                return e2[1] - e1[1]
            })

            let data: string[][] = [];
            sortable.forEach(([key, value]) => {
                //console.log((value/3600).toString())
                let hours = Math.floor(value / 3600)
                let secondsLeft = value - (hours * 3600)
                let minutes = Math.floor(secondsLeft / 60)
                secondsLeft = secondsLeft - (minutes * 60)
                data.push([key, hours + ":" + minutes + ":" + secondsLeft])
            })

            this.setState({report: data}, () => {
                this.filterReport(() => this.makeChartData()) // update chart after files are uploaded and filtered
            })
            
            

             

        })
    }

    filterReport(callback?: () => void) {
        this.setState((state) => {
            let filterSet = new Set<String>()
            //TODO: Filter functionality
            /*
            let filterSet = new Set<string>(["Pej 2021", "Gym", "D-sektionen", "Vardagssysslor", "hemsida", "Bryggeri", "C++ fritid", "D-pong", 
                "D-Pong 2020", "D-sek", "DWWW", "EDAA01 Labbledare 2020", "JavaFXGraphics", "Jobbsök", "Labbledare fördjupningskursen", 
                "Labbledare forts.", "Labbledare forts. 2", "Labbledare forts. 3", "Labbledare forts. 4", "libGDX", "Medaljelele", "PEJ", "PEJ2", 
                "PEJ2020", "Physics2D", "Spel", "Sommarprojekt", "PubProjekt", "" ])
            */
            let newReport : string[][] = []
            state.report.forEach((row : string[]) => {
                if (!filterSet.has(row[0])) {
                    newReport.push(row)
                }
            })
            return {report : newReport}
        }, callback)
    }

    makeChartData() {
        let labels : string[] = [];
        
        let dataset : ChartData = {
            label: "Hours",
            data: [],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
        }
        
        this.state.report.forEach(row => {
            
            
            labels.push(row[0]);
            let timeSplit = row[1].split(':');
            let seconds = (+timeSplit[0]) + (+timeSplit[1]) / 60 + (+timeSplit[2]) /(60*60);

            dataset.data.push(seconds);
            
        });
        let chartdata = {labels, datasets: [dataset]}
        this.setState({ chartData: chartdata })
        console.log(this.state.report)
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
                                <button type="submit" className="btn btn-primary ml-3" onClick={this.makeReport}>Convert to Report</button>
                            </div>
                            : <></>
                        }
                        
                        { this.state.chartData != null ? <Bar data={this.state.chartData} /> : <></> }

                        {
                            this.state.mergedFile.length > 0 ? 
                            <div className="row mt-3">
                                <CSVLink data={this.state.mergedFile} enclosingCharacter='' filename={"merged-entries"}>Download Merged CSV</CSVLink>
                            </div>
                            : <></>
                        }
                        {
                            this.state.report.length > 0 ? 
                            <div className="row mt-3">
                                <CSVLink data={this.state.report} enclosingCharacter='' filename={"report"}>Download Report CSV</CSVLink>
                            </div>

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