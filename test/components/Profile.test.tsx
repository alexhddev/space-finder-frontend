import React from "react";
import { Profile } from "../../src/components/Profile";
import ReactDOM from "react-dom";
import { User, UserAttribute } from "../../src/model/Model";
import { AuthService } from "../../src/services/AuthService";
import { StaticRouter } from "react-router";

const someUser: User = {
  userName: "someUser",
  email: "some@email.com",
};
const someUserAttributes: UserAttribute[] = [
  {
    Name: "Age",
    Value: "25",
  },
  {
    Name: "Position",
    Value: "Manager",
  },
];

describe("Profile test suite", () => {
  let container: HTMLDivElement;
  const authServiceMock = {
    getUserAttributes: jest.fn(),
  };

  test("Setup test with user", () => {
    authServiceMock.getUserAttributes.mockResolvedValue(someUserAttributes);
    container = document.createElement("div");
    document.body.appendChild(container);
    ReactDOM.render(
      <Profile
        user={someUser}
        authService={(authServiceMock as any) as AuthService}
      />,
      container
    );
  });

  test("renders component with user correctly", () => {
    const table = container.querySelector("table");
    expect(table!.rows.length).toBe(2);
  });

  test("teardown test with user", () => {
    document.body.removeChild(container);
    container.remove();
    jest.clearAllMocks(); //nice point about calls here
  });

  test("Setup test without user", () => {
    authServiceMock.getUserAttributes.mockResolvedValue(someUserAttributes);
    container = document.createElement("div");
    document.body.appendChild(container);
    ReactDOM.render(
      <StaticRouter>
        <Profile
          user={undefined}
          authService={(authServiceMock as any) as AuthService}
        />
      </StaticRouter>,
      container
    );
  });

  test("renders component without user correctly", () => {
    expect(authServiceMock.getUserAttributes).toBeCalledTimes(0);
    const table = container.querySelector("table");
    expect(table).toBeNull();
  });

  test("teardown test without user", () => {
    document.body.removeChild(container);
    container.remove();
  });
});
