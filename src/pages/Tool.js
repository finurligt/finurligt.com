import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './tool.css'

export class Tool extends Component {
    constructor(props) {
        super(props);

        this.state = {
            kurstillvaxt: 0.07,
            direktavkastning: 0.00,
            aterinvesteras: true,
            chablonskatt: 0.0145,
            kapitalskatt: 0.3,
            maxYears: 18,
            initialtVarde: 100.0,
        }

        
        this.generateValues(this.state)
    }

    generateValues(initialValues) {
        let kurstillvaxt = initialValues.kurstillvaxt + 1;
        let kurstillvaxtQ = Math.pow(kurstillvaxt, 1/4);
        let direktavkastning = initialValues.direktavkastning + 1;
        let aterinvesteras = initialValues.aterinvesteras;
        let chablonskatt = initialValues.chablonskatt;
        let kapitalskatt = initialValues.kapitalskatt;
        let maxYears = initialValues.maxYears;
        let initialtVarde = initialValues.initialtVarde;

        let iskData = [];
        let afGrossData = [];
        let afNetData = [];

        //isk
        let iskVarde = initialtVarde;
        let iskUtdelning = 0;
        for (let year = 0; year < maxYears; year++) {
            //kurstillvaxt och basen för chablonskatten räknas ut
            let yearValue = 0;
            for (let quarter = 0; quarter < 4; quarter++) {
                yearValue += iskVarde/4;
                iskVarde *= kurstillvaxtQ;
                iskData.push(iskVarde);
            }
        
            //nu kommer direktavkastning och chablonskatt
            if (aterinvesteras) {
                iskVarde *= direktavkastning;
            } else {
                iskUtdelning += (iskVarde*direktavkastning);
            }
            iskVarde -= (chablonskatt*yearValue);
        }

        let afValue = initialtVarde;
        let afUtdelning = 0;
        for (let year = 0; year < maxYears; year++) {
            //afValue *=kurstillvaxt;
            for (let quarter = 0; quarter < 4; quarter++) {
                afValue *= kurstillvaxtQ;
                afGrossData.push(afValue);
                afNetData.push(initialtVarde + ((afValue - initialtVarde)*(1-kapitalskatt)));
            }

            

            if (aterinvesteras) {
                afValue = afValue + (afValue*(direktavkastning - 1) * (1-kapitalskatt));
            } else {
                afUtdelning = afUtdelning + (afValue*direktavkastning * (1-kapitalskatt));
            }
        }

        console.log(iskData[iskData.length-1]);
        console.log(afGrossData[afGrossData.length-1]);
        console.log(afNetData[afNetData.length-1]);
        console.log(iskData.length);
        console.log(afGrossData.length);
        console.log(afNetData.length);
    }

    render() {
        return (
            <>
                <div className="row" style={{
                    margin: 0
                }}>
                    <div className="col-sm-3" style={{}}></div>

                    <div className="col-sm-6" style={{ backgroundColor: "white" }}>

                        <form className='tool-form' >
                            <div className="form-group">
                                <label htmlFor="kurstillvaxt">Årlig kurstillväxt</label>
                                <input type="number" step="0.00001" className="form-control" id="kurstillvaxt" aria-describedby="kurstillvaxtHelp" placeholder="0.07" />
                                <small id="kurstillvaxtHelp" className="form-text text-muted">
                                    Årlig värdeökning på en aktie exklusive utdelning, ibland kallas denna siffra även för avkastning men då är det lite oklart på vilket sätt utdelningar inkluderas. Kurstillväxten på Stockholmsbörsen varierar alltid.
                                    I perioden 1870 - 2019 låg den totala avkastningen (kurstillväxt + återinvestering av avkastning) på i snitt 9.24%. Från 1990 till 2019 låg avkastningen (exklusive utdelningar? OMX30, <a href="https://rikatillsammans.se/stockholmsborsens-arliga-avkastning/">källa</a>) på 12.49%,
                                    och 2009 - 2019 låg den på 10.51%. Det är vanligt att man räknar med en avkastning på 7%, eller 9% för de mer optimistiska, men dessa siffror brukar inkludera direktavkastning.
                                    Om du bara har värdepapper som inte ger utdelning (tex fonder) kan du bara ange den totala avkastningen här, men annars är det viktigt att det är just kurstillväxten du anger.
                                    </small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="direktavkastning">Direktavkastning</label>
                                <input type="number" step="0.00001" className="form-control" id="direktavkastning" aria-describedby="kurstillvaxtHelp" placeholder="0.00" />
                                <small id="direktavkastningHelp" className="form-text text-muted">Procentandel av värdet på en aktie som ges tillbaka som utdelning. För en fond är detta värdet 0. I skrivande stund ligger medeln på Stockholmsbörsen på 3.4%.</small>
                            </div>
                            <div className="checkbox">
                                <label>
                                    <input id='aterinvesteras' type="checkbox" checked={true}/> <small className="text-muted">Direktavkastning återinvesteras</small>
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="schablonskatt">Schablonskatt</label>
                                <input type="number" step="0.00001" className="form-control" id="schablonskatt" aria-describedby="schablonskattHelp" placeholder="0.015" />
                                <small id="schablonskattHelp" className="form-text text-muted">Schablonskatten har historiskt sett legat mellan 0.90% och 2.09%. <a href="https://sv.wikipedia.org/wiki/Investeringssparkonto">Källa</a>.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="kapitalskatt">Kapitalskatt</label>
                                <input type="number" step="0.00001" className="form-control" id="kapitalskatt" aria-describedby="kapitalskattHelp" placeholder="0.30" />
                                <small id="kapitalskattHelp" className="form-text text-muted">Kapitalskatten har legat på 30% i över 30 år.</small>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>

                    </div>

                    <div className="col-sm-3"></div>
                </div>
            </>
        )
    }
}

export default Tool
