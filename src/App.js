import './styles/App.scss'; 
import Game from './Game'
import Instructions from './Instructions'


const App = () => {

    //||||||||||| DOM |||||||||||
    return (
        <div className="page">
            <main>
                <Game />
                <Instructions />
            </main>
            <footer>
                <p>Shapes from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></p>
                <p>Made by Jaime Robbins at <a href="www.junocollege.com">Juno College</a></p>
            </footer>
        </div>
    );
};

export default App;