import React from "react";
import { Link } from "react-router-dom";
import { Reservation, User } from "../../model/Model";
import { DataService } from "../../services/DataService";
import { ReservationComponent } from "./ReservationComponent";

interface ReservationsState {
    reservations: Map<string, Reservation>
}
interface ReservationsProps {
    user: User | undefined,
    dataService: DataService
}

export class Reservations extends React.Component<ReservationsProps, ReservationsState> {

    constructor(props: ReservationsProps){
        super(props);
        this.state = {
            reservations: new Map<string, Reservation>()
        }
        this.cancelReservation = this.cancelReservation.bind(this);
        this.approveReservation = this.approveReservation.bind(this);
        this.deleteReservation = this.deleteReservation.bind(this);
    }

    async componentDidMount() {
        const reservations = await this.props.dataService.getReservations();
        this.setState({
            reservations: new Map(reservations.map(i=>[i.reservationId, i]))
        });
    }

    private async approveReservation(reservationId: string){
        const reservationsCopy = new Map(this.state.reservations);
        const toApproveReservation = reservationsCopy.get(reservationId);
        if (toApproveReservation) {
            toApproveReservation.state = "APPROVED"
            this.setState({
                reservations: reservationsCopy
            });
            await this.props.dataService.updateReservation(reservationId, "APPROVED");
        }
    }
    private async cancelReservation(reservationId: string){
        const reservationsCopy = new Map(this.state.reservations);
        const toApproveReservation = reservationsCopy.get(reservationId);
        if (toApproveReservation) {
            toApproveReservation.state = "APPROVED"
            this.setState({
                reservations: reservationsCopy
            });
            await this.props.dataService.updateReservation(reservationId, "CANCELED");
        }
    }
    private async deleteReservation(reservationId: string){
        const reservationsCopy = new Map(this.state.reservations);
        reservationsCopy.delete(reservationId);
        this.setState({
            reservations: reservationsCopy
        })
        await this.props.dataService.deleteReservation(reservationId);
    }

    


    private renderReservations(){
        const rows: any[] = []

        this.state.reservations.forEach((reservation) =>{
            rows.push(
                <ReservationComponent
                    key = {reservation.reservationId}
                    reservationId = {reservation.reservationId}
                    spaceId = {reservation.spaceId}
                    state = {reservation.state}
                    user = {reservation.user}
                    approveReservation ={this.approveReservation}
                    cancelReservation = {this.cancelReservation}
                    deleteReservation = {this.deleteReservation}
                />
            )
        })
        return <table>
            <tbody>
            {rows}
            </tbody>
        </table>
    }

    render(){
        if (this.props.user) {
            return <div>
                Hello {this.props.user.userName}<br></br>
                {this.renderReservations()}
            </div>
        } else {
            return <div>
            Please <Link to='login'>Login</Link>
         </div>
        }
    }
}