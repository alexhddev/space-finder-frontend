import React from "react";
import { Reservation } from "../../model/Model";

interface ReservationsProps extends Reservation {
    approveReservation?: (reservationId: string) => void;
    cancelReservation?: (reservationId: string) => void;
    deleteReservation?: (reservationId: string) => void;
}


export class ReservationComponent extends React.Component<ReservationsProps> {

    private renderCancelButton() {
        if (this.props.cancelReservation) {
            return <td>
                <button onClick={() => this.props.cancelReservation!(this.props.reservationId)}>
                    cancel
                    </button>
            </td>
        }
    }
    private renderApproveButton() {
        if (this.props.approveReservation) {
            return <td>
                <button onClick={() => this.props.approveReservation!(this.props.reservationId)}>
                    approve
                </button>
            </td>



        }
    }
    private renderDeleteButton() {
        if (this.props.deleteReservation) {
            return <td>
                <button onClick={() => this.props.deleteReservation!(this.props.reservationId)}>
                    delete
                    </button>
            </td>
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.user}</td>
                <td>{this.props.spaceId}</td>
                <td>{this.props.state}</td>
                {this.renderApproveButton()}
                {this.renderCancelButton()}
                {this.renderDeleteButton()}
            </tr>
        )
    }
}