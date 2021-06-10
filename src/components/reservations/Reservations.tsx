import React from "react";
import { Link } from "react-router-dom";
import { User } from "../../model/Model";
import { DataService } from "../../services/DataService";

interface ReservationsState {}
interface ReservationsProps {
    user: User | undefined,
    dataService: DataService
}

export class Reservations extends React.Component<ReservationsProps, ReservationsState> {


    private renderReservations(){
        if (this.props.user) {
            return <div>
                Hello {this.props.user.userName}
            </div>
        } else {
            return <div>
            Please <Link to='login'>Login</Link>
         </div>
        }
    }

    render(){
        return(
            <div>
                Welcome to the Reservations page!
                {this.renderReservations()}
            </div>
        )
    }
}