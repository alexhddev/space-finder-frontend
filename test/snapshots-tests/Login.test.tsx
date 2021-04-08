import { Login } from '../../src/components/Login'
import { create } from 'react-test-renderer'


describe('Login component snapshot testing', ()=>{

    test('initial test', ()=>{
        const snap = create(<Login 
            authService={{}as any}
            setUser={{}as any}
        />)
        expect(snap).toMatchSnapshot();
    })

})