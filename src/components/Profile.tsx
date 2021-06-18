import React from "react";
import { Link } from "react-router-dom";
import { User, UserAttribute } from "../model/Model";
import { AuthService } from "../services/AuthService";
import { DataService } from "../services/DataService";

interface CustomEvent {
    target: HTMLInputElement
}

interface ProfileState {
    userAttributes: UserAttribute[]
    profilePhoto: string | undefined
}
interface ProfileProps {
    user: User | undefined
    authService: AuthService
    dataService: DataService
}

export class Profile extends React.Component<ProfileProps, ProfileState> {

    state: ProfileState = {
        userAttributes: [],
        profilePhoto: undefined
    }

    private renderAttributesTable() {
        return <table>
            <tbody>
                {this.renderProfilePicture()}
                {this.renderUserAttributes()}
                {this.renderPictureOptions()}
            </tbody>
        </table>
    }

    render() {
        let profileSpace
        if (this.props.user) {
            profileSpace = <div>
                <h3>Hello {this.props.user.userName}</h3>
                Here are your attributes:
                {this.renderAttributesTable()}
            </div>
        } else {
            profileSpace = <div>
                Please <Link to='login'>Login</Link>
            </div>
        }

        return (
            <div>
                Welcome ti the profile page!
                {profileSpace}
            </div>
        )
    }

    async componentDidMount() {
        if (this.props.user) {
            const userAttributes = await this.props.authService.getUserAttributes(this.props.user);
            const picUrl = userAttributes.find(atr => atr.Name === 'picture');
            if (picUrl) {
                this.setState({
                    profilePhoto: picUrl.Value
                })
            }
            this.setState({
                userAttributes: userAttributes
            })
        }
    }

    private renderUserAttributes() {
        const rows = []
        for (const userAttribute of this.state.userAttributes) {
            if (userAttribute.Name !== 'picture') {
                rows.push(<tr key={userAttribute.Name}>
                    <td>{userAttribute.Name}</td>
                    <td>{userAttribute.Value}</td>
                </tr>)
            }
        }
        return rows
    }

    private renderProfilePicture() {
        if (this.state.profilePhoto) {
            return <tr key={'picture'}><td colSpan={2}>
                <img src={this.state.profilePhoto} alt={'picturez'} /></td></tr>
        }
    }

    private renderPictureOptions() {
        if (this.state.profilePhoto) {
            return <tr>
                <td colSpan={2}>You've got a great picture</td>
            </tr>
        } else {
            return <tr>
                <td>Upload profile picture</td>
                <td><input type='file' onChange={e => this.setProfilePicture(e)}></input></td>
            </tr>
        }
    }
    private async setProfilePicture(event: CustomEvent) {
        const files = event.target.files
        if (files && files[0]) {
            console.log('File' + files[0].name);
            const result = await this.props.dataService.uploadProfilePicture(files[0]);
            this.setState({
                profilePhoto: result
            })
            if (this.props.user) {
                await this.props.authService.updateProfilePicture(
                    this.props.user,
                    result
                )
            }
        }
    }
}