import { Component } from "react";
import './ConfirmModalComponentProps.css';

interface ConfirmModalComponentProps {
    show: boolean,
    content: string,
    close: () => void
}

export class ConfirmModalComponent extends Component<ConfirmModalComponentProps> {

    render() {
        if (!this.props.show) {
            return null
        } else {
            return <div className='modal'>
                <div className='modal-content'>
                    <h2>You tried to reserve and ...</h2>
                    <h3 className='modalText'>{this.props.content}</h3>
                    <button  className='modalButton' onClick={()=> this.props.close()} >Ok, close</button>
                </div>
            </div>
        }
    }

}