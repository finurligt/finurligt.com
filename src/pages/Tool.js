import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './tool.css'

export class Tool extends Component {
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
                                <input type="number" step="0.001" className="form-control" id="kurstillvaxt" aria-describedby="kurstillvaxtHelp" placeholder="0.07" />
                                <small id="kurstillvaxtHelp" className="form-text text-muted">
                                    Årlig värdeökning på en aktie exklusive utdelning, ibland kallas denna siffra även för avkastning men då är det lite oklart på vilket sätt utdelningar inkluderas. Kurstillväxten på Stockholmsbörsen varierar alltid. 
                                    I perioden 1870 - 2019 låg den totala avkastningen (kurstillväxt + återinvestering av avkastning) på i snitt 9.24%. Från 1990 till 2019 låg avkastningen (exklusive utdelningar? OMX30, <a href="https://rikatillsammans.se/stockholmsborsens-arliga-avkastning/">källa</a>) på 12.49%, 
                                    och 2009 - 2019 låg den på 10.51%. Det är vanligt att man räknar med en avkastning på 7%, eller 9% för de mer optimistiska, men dessa siffror brukar inkludera direktavkastning.
                                    Om du bara har värdepapper som inte ger utdelning (tex fonder) kan du bara ange den totala avkastningen här, men annars är det viktigt att det är just kurstillväxten du anger.
                                    </small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="direktavkastning">Direktavkastning</label>
                                <input type="number" step="0.001" className="form-control" id="direktavkastning" aria-describedby="kurstillvaxtHelp" placeholder="0.03" />
                                <small id="direktavkastningHelp" className="form-text text-muted">Procentandel av värdet på en aktie som ges tillbaka som utdelning. För en fond är detta värdet 0. I skrivande stund ligger medeln på Stockholmsbörsen på 3.4%.</small>
                                <label className="form-check-label" htmlFor="exampleCheck1">Utdelning återinvesteras.</label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="schablonskatt">Schablonskatt</label>
                                <input type="number" step="0.001" className="form-control" id="schablonskatt" aria-describedby="schablonskattHelp" placeholder="0.03" />
                                <small id="schablonskattHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="kapitalskatt">Kapitalskatt</label>
                                <input type="number" step="0.001" className="form-control" id="kapitalskatt" aria-describedby="kapitalskattHelp" placeholder="0.30" />
                                <small id="kapitalskattHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
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
