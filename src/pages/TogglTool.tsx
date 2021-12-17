import React from 'react'

type MyProps = {
    // using `interface` is also ok
    message: string;
};

type MyState = {
    file: File | null; // like this
};

type TimeEntry = {
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
    }
    state: MyState = {
        file: null
    };

    setFile(e : any) {
        console.log(e.target.files)
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
            let header = data[0];
            data = data.slice(1)

            console.log(data[0])

        }
        fileReader.readAsText(e.target.files[0])
    }

    createTimeEntry(text: string) : TimeEntry {
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
                        <input type="file" name="file" onChange={this.setFile}/>
			            <div>
				            <button>Submit</button>
			            </div>
                    </div>
                    <div className="col-sm-3"></div>
                </div>
			    
		    </div>
        );
    }
}

export default TogglTool;