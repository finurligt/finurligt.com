import React, { Component } from 'react'
import './Home.css'

export class Home extends Component {
    render() {
        return (
            <>
                <div className="row" style={{
                    margin: 0,
                }}>
                    <div className="col-sm-2" style={{}}></div>

                    <div className="col-sm-8" style={{ backgroundColor: "white", textAlign: "center" }}>
                        <header className="masthead text-center">
                            <h1 className="masthead-heading mb-0">Tja</h1>

                            <p className="masthead-subheading font-weight-light mb-0">Jag heter Fabian.</p>
                            <p className="masthead-subheading font-weight-light mb-0">Jag läser till civilingenjör i datateknik.</p>
                            <p className="masthead-subheading font-weight-light mb-0">Ibland gör jag lite dumma projekt och lägger upp dem här.</p>

                        </header>

                    </div>

                    <div className="col-sm-2"></div>
                </div>
            </>
        )
    }
}

export default Home
