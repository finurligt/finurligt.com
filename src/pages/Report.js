import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'

export class Report extends Component {
    constructor(props) {
        super(props);
        this.readFile = this.readFile.bind(this);
        this.makeChartData = this.makeChartData.bind(this);

        this.state = {
            chartData: {
                labels: ["a","b","c"],
                datasets: [{
                    label: "Hours",
                    data: [1,2,3],
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                }]
            }
        }
    }

    componentDidMount() {
        this.readFile("reportdata.txt");
    }
    
    readFile(file){
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = () =>
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status === 0)
                {
                    var allText = rawFile.responseText;
                    this.makeChartData(allText)
                }
            }
        }
        rawFile.send(null);
    }

    makeChartData(text) {
        let labels = [];
        let dataset = {
            label: "Hours",
            data: [],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
        }
        
        text.split('\n').forEach(element => {
            let split = element.split(',')
            
            labels.push(split[0]);
            let timeSplit = split[1].split(':');
            var seconds = (+timeSplit[0]) + (+timeSplit[1]) / 60 + (+timeSplit[2]) /(60*60);

            dataset.data.push(seconds);
            
        });
        let chartdata = {labels, datasets: [dataset]}
        console.log(dataset)
        this.setState({ chartData: chartdata })
    }
    
    render() {
        return (
            <>
                <div className="row" style={{
                    margin: 0
                }}>
                    <div className="col-sm-2" style={{}}></div>

                    <div className="col-sm-8" style={{ backgroundColor: "white" }}>
                        <h2 className="mt-3" >Timetracking</h2>
                        <small id="slutsats" className="form-text text-muted">Jag trackar långt ifrån allt mitt plugg. 
                        Det jag brukar tracka är "intensivt plugg", det vill säga när jag tentapluggar själv, men även där är det inte alltid jag kommer ihåg att sätta igång timern. 
                        Grafen är därmed inte jätteanvändbar, men kan ge en vag uppfattning om vilka tentor jag tyckte var svårast (eller vilka kurser jag tyckte var kul och därmed la extra tid på...). 
                        Jag började tracka i slutet på första terminen på tvåan, vilket är varför en del kurser saknas eller har väldigt låg summa av tid. Det finns även några kurser här som jag inte har för avsikt att avsluta.
                        </small>
                        
                        <Bar data={this.state.chartData} />
                    
                    </div>

                    <div className="col-sm-2"></div>
                </div>
            </>
        )
    }
}

export default Report
