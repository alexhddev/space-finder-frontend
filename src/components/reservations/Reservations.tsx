import React from "react";
import { Link } from "react-router-dom";
import { Reservation, User } from "../../model/Model";
import { DataService } from "../../services/DataService";

interface ReservationsState {
    reservations: Reservation[]
}
interface ReservationsProps {
    user: User | undefined,
    dataService: DataService
}

export class Reservations extends React.Component<ReservationsProps, ReservationsState> {

    constructor(props: ReservationsProps){
        super(props);
        this.state = {
            reservations: []
        }
        this.cancelReservation = this.cancelReservation.bind(this);
        this.approveReservation = this.approveReservation.bind(this);
        this.deleteReservation = this.deleteReservation.bind(this);
    }

    async componentDidMount() {
        const reservations = await this.props.dataService.getReservations();
        this.setState({
            reservations: reservations
        });
    }

    private async approveReservation(reservationId: string){
        console.log(`Approving reservation ${reservationId}`)
    }
    private async cancelReservation(reservationId: string){
        console.log(`Canceling reservation ${reservationId}`)
    }
    private async deleteReservation(reservationId: string){
        console.log(`Deleting reservation ${reservationId}`)
    }

    


    private renderReservations(){

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