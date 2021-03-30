import ReactDOM from 'react-dom';
import { Login } from '../../src/components/Login';


describe('Login component test suite', () => {

    let container: HTMLDivElement;
    const authServiceMock = {
        login: jest.fn()
    }
    const setUserMock = jest.fn();

    beforeEach(() => {
        container = document.createElement('div');
        document.appendChild(container);
        ReactDOM.render(
            <Login authService={authServiceMock as any} setUser={setUserMock}/>,
            container
        )
    })

    afterEach(() => {
        document.body.removeChild(container);
        container.remove();
        jest.clearAllMocks();
    })

    test('initial test', () => {
        expect(true).toBeTruthy();
    })
})