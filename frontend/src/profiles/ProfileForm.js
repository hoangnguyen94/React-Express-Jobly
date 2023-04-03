import React, { useState, useContext } from "react";
import Alert from "../common/Alert";
import JoblyApi from "../api/api";
import UserContext from "../auth/UserContext";

//eslint-disable-next-line
import useTimedMessage from "../hooks/useTimedMessage";

/** Profile editing form.
 *
 * Displays profile form and handles changes to local form state.
 * Submitting the form calls the API to save, and triggers user reloading
 * throughout the site.
 *
 * Confirmation of a successful save is normally a simple <Alert>, but
 * you can opt-in to our fancy limited-time-display message hook,
 * `useTimedMessage`, but switching the lines below.
 *
 * Routed as /profile
 * Routes -> ProfileForm -> Alert
 */

const ProfileForm = () =>
{
    const { currentUser, setCurrentUser } = useContext( UserContext );
    const [ formData, setFormData ] = useState( {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username,
        password: ""
    } );

    //switch to use our limmited-time-display message hook
    const [ saveConfirmed, setSaveConfirmed ] = useState( false );

    console.debug(
        "ProfileForm",
        "currentUser=", currentUser,
        "formErrors=", formErrors,
        "saveConfirmed=", saveConfirmed
    );

    /** on form submit:
     * - attempt save to backend & report any errors
     * - if successful
     *     -clear previous error messages and password
     *     -show save-confirmed message
     *     -set current user info throughout the site
     */

    async function handleSubmit ( e )
    {
        e.preventDefault();

        let profileData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
        };

        let username = formData.username;
        let updatedUser;

        try
        {
            updatedUser = await JoblyApi.saveProfile( username, profileData );
        } catch ( err )
        {
            debugger;
            setFormErrors( err )
            return;
        }

        setFormData( f => ( { ...f, password: "" } ) );
        setFormErrors( [] );
        setSaveConfirmed( true );

        /**trigger reloading of user information throughout the site */
        setCurrentUser( updatedUser );
    }

    /**Handle form data changing */
    const handleChange = ( e ) =>
    {
        const { name, value } = e.target;
        setFormData( f => ( {
            ...f,
            [ name ]: value
        } ) );
        setFormErrors( [] );
    }

    return (
        <div className="col-md-6 col-lg-4 offset-md-3 offset-lg-4">
            <h3>Profile</h3>
            <div className="card">
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label>Username</label>
                            <p className="form-control-plaintext">{formData.username}</p>
                        </div>

                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                name="firstname"
                                className="form-control"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                name="lastname"
                                className="form-control"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm password to make changes:</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {formErrors.length
                            ? <Alert type="danger" messages={formErrors} />
                            : null}
                        
                        {saveConfirmed
                            ? <Alert type="success" messages={[ "Updated successfully." ]} />
                            : null}
                        
                        <button
                            className="btn btn-primary btn-block mt-4"
                            onClick={handleSubmit}
                        >
                            Save changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm;
