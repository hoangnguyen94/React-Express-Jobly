import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Navigation from "./Navigation";
import { UserProvider } from "../testUtils";

/**Navigation bar for site. Shows up on every page.
 * 
 * When user is logged in, shows links to main areas of site 
 * which not have Login and Signup forms.
 */

it( "renders without crashing", function () 
{
    render(
        <MemoryRouter>
            <UserProvider>
                <Navigation />
            </UserProvider>
        </MemoryRouter>,
    );
} );

it( "matches snapshot", function () 
{
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <Navigation />
            </UserProvider>
        </MemoryRouter>,
    );
    expect( asFragment() ).toMatchSnapshot();
} );

it( "matches snapshot when logged out", function () 
{
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider currentUser={null}>
                <Navigation />
            </UserProvider>
        </MemoryRouter>,
    );
    expect( asFragment() ).toMatchSnapshot();
} );
