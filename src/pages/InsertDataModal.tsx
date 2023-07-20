import React, { ChangeEvent, ChangeEventHandler } from 'react'
import { Alert } from 'react-bootstrap';
import firebase from 'firebase/app';


type MyProps = {
    // using `interface` is also ok
    //message: string;
    handleData: (data: string, time: number, daysAgo : number) => Promise<(firebase.database.Reference | null)[]>
};

type MyState = {
    data: string;
    daysAgo: number;
    time: number;
    error: string;
    loading: boolean;
};

class InsertDataModal extends React.Component<MyProps, MyState> {
    modalRef: any;
    constructor(props : MyProps) {
        super(props);
        this.modalRef = React.createRef();

        this.setDaysAgo = this.setDaysAgo.bind(this)
        this.setTime = this.setTime.bind(this)


    }

    state: MyState = {
        data: "",
        daysAgo: 0,
        time: -1,
        error: "",
        loading: false,
    };

    insertData() {
        this.setState({ error: "", loading: true })
        this.props.handleData(this.state.data, this.state.time, this.state.daysAgo)
            .then(() => {
                this.modalRef.current.click();
                this.setState({ loading: false })
            })
        
    }

    setDaysAgo(e : ChangeEvent<HTMLInputElement>) {
        this.setState(
            { daysAgo: !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : -1 }
        );
    }

    setTime(e : ChangeEvent<HTMLInputElement>) {
        this.setState(
            { time: !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : -1 }
        );
    }

    render() {
        const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {        
            this.setState({
                data: event.target?.value
            })
          };
          

        return (
            <>
                <div className="modal fade" id="modalInsertDataForm" tabIndex={-1} role="dialog"
                    aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header text-center">
                                <h4 className="modal-title w-100 font-weight-bold">Insert Data</h4>
                                <button ref={this.modalRef} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body mx-3">
                                <div className="md-form mb-5">
                                    <i className="fas fa-envelope prefix grey-text"></i>
                                    <textarea onChange={handleChange} name="text" className="form-control validate" id="defaultForm-text" />
                                    <label data-error="wrong" data-success="right" htmlFor="defaultForm-text">Data</label>
                                </div>
                                <input onChange={this.setDaysAgo} name="daysAgo" type="number" id="defaultForm-daysAgo" className="form-control validate" />
                                <label data-error="wrong" data-success="right" htmlFor="defaultForm-daysAgo">Days Ago</label>
                                <input onChange={this.setTime} name="time" type="number" id="defaultForm-time" className="form-control validate" />
                                <label data-error="wrong" data-success="right" htmlFor="defaultForm-time">Time</label>
                                {this.state.error && <Alert variant='danger'>{this.state.error}</Alert>}

                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                
                                <button disabled={this.state.loading} onClick={() => this.insertData()} className="btn btn-default">Process Data</button>
                                
                            </div>
                        </div>
                    </div>
                </div>
			    
		    </>
        );
    }
}

export default InsertDataModal;