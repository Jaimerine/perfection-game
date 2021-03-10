import { useState, useEffect } from 'react';
import firebase from './firebase.js';

export default function LeaderBoard(props) {
    
    //database reference
    const dbRef = firebase.database().ref();

    const [playersArray, setPlayersArray] = useState([]);
    const [nameInput, setNameInput] = useState('');
    

//||||||||||| EFFECT FUNCTIONS |||||||||||

//DB EVENT LISTENER: listen to 'value' changes on name input
    useEffect(() => {

        //initialize firebase event listener
        dbRef.on('value', (data) => {
            
            //save database object
            const playerData = data.val();           

            //get players name and time from db and push to temp array
            const playersArrayTemp = [];
            for (const playerKey in playerData) {
                playersArrayTemp.push({
                    key: playerKey,
                    name: playerData[playerKey].name,
                    time: playerData[playerKey].time,
                    date: playerData[playerKey].date
                });
            }

            //update players array
            setPlayersArray(playersArrayTemp);
        });

        //close db
        return () => {
            console.log('datase connection closed')
            dbRef.off();
        }

    }, [dbRef])

    //input value change event handler
    function handleChange(event) {
        setNameInput(event.target.value);
    }

    //form submit event handlier
    function handleSubmit(event, anonymous) {
        
        //prevent default form behaviour
        event.preventDefault();

        //if no name provided, set name as anonymous
        let name = nameInput;
        if (!name || anonymous === true) {
            name = 'Anonymous'
        }
        setNameInput(name);

        //push player data to db
        dbRef.push({name: name, time: props.time, date: new Date()});

        //reset value of input
        setNameInput('');

        //unmount modal
        props.setIsGameOverFn(false)
    }

    return (
        <>
        { //show modal if applicable
            props.isGameOver
                ? <div className="modal">
                    <div className="modal-content">
                        <button className="modal-close" aria-label="close button" onClick={() => {props.setIsGameOverFn(false)}}>&times;</button>
                        <div>
                            { //if winner, ask for name, else display message
                                props.isWinner
                                    ?   <>
                                        <p>Wow, great job! You finished in {props.time} seconds!</p>
                                        <form action="">
                                            <label htmlFor="name">Enter your name below to be added to the leader board:</label>
                                                <input type="text" id="name" placeholder="Molly Robbins" value={nameInput} onChange={(event) => { handleChange(event)}} />
                                                <button onClick={(event) => {handleSubmit(event)}}>Put my name on the Books!</button>
                                            <button onClick={(event) => {handleSubmit(event, true)}}>Nah, I don't need the world to know how awesome I am!</button>
                                        </form>

                                        </>
                                    : <p>Times Up! I'm sure you'll win the next round!</p>
                            }
                        </div>
                    </div>
                </div>

                : null
        }

        {/* leaderboard */}
            <section className="paper wrapper" id="leader-board">
                <div className="text">
                    <h2>Leader Board</h2>
                    <ul className="leaders">
                        { //if players exist, map throuh array and display
                            playersArray.length > 0
                                ? playersArray.map((player) => {
                                    return (
                                    
                                        <li key={player.key}>
                                            <span>{player.name}</span> <span>{player.time}s</span>
                                        </li>
                                    )
                                })
                                : 'No players yet!'
                        }
                    </ul>
                </div>
                <div className="lines"></div>
            </section>

        </>
    )

}


