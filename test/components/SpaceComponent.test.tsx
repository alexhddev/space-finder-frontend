import { SpaceComponent } from '../../src/components/spaces/SpaceComponent'
import ReactDOM from "react-dom";



describe('Space component test suite', ()=>{
    let container: HTMLDivElement;
    const reserveSpaceMock = jest.fn();


    describe('tests with photo URL', ()=>{

        beforeEach(()=>{
            container = document.createElement('div');
            document.body.appendChild(container)
            ReactDOM.render(<SpaceComponent 
                location={'someLocation'}
                name={'someName'}
                reserveSpace={reserveSpaceMock}
                spaceId={'123'}
            />,
            container)
        })

        test('basic rendering', ()=>{
            
        })

        afterEach(()=>{
            document.body.removeChild(container);
            container.remove();
            jest.clearAllMocks();
        })

    })

    describe('tests without photo URL', ()=>{
        
    })

});