import { useState, useEffect } from 'react';
import ShapeComponent from './ShapeComponent' //shape svgs
import outerTimerImg from './assets/outer-timer.svg'; //timer image
import innerTimerImg from './assets/inner-timer.svg'; //timer image
import LeaderBoard from './LeaderBoard' //modal component (sets to db)
import { placeholderShapesArrayStart, draggableShapesArrayStart } from './shapeArrays' //shape arrays

export default function Game() {

//||||||||||| HELPER FUNCTIONS |||||||||||

    const shuffleArray = (array) => {
        const arrayCopy = JSON.parse(JSON.stringify(array));
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }

        return arrayCopy;
    }


//||||||||||| GLOBAL VARS + STATE |||||||||||

    let draggingItem = {}; //stores shape being dragged
    let dragOverItem = {}; //stores placeholder shape dragged over
    const timeout = 20; //seconds to sort shapes
    const winningCount = 3; //number of shapes to place

    //shuffled deep copies of original shape arrays
    const [placeholderShapesArray, setPlaceholderShapesArray] = useState(shuffleArray(JSON.parse(JSON.stringify(placeholderShapesArrayStart))));
    const [draggableShapesArray, setDraggableShapesArray] = useState(shuffleArray(JSON.parse(JSON.stringify(draggableShapesArrayStart))));
    
    const [gameStatus, setGameStatus] = useState(null); //on, off, playing
    const [isGameOver, setIsGameOver] = useState(false); //whether game is over
    const [shapeCount, setShapeCount] = useState(0); //number of shapes placed
    const [isWinner, setIsWinner] = useState(false); //whether player is a winner
    const [startTime, setStartTime] = useState(0); //time started
    const [time, setTime] = useState(null); //time elapsed since started


//||||||||||| EFFECT FUNCTIONS |||||||||||

    //GAME STARTED/RESET: shuffle arrays and reset variables on game start, clear timer on end
    useEffect( () => {
        
        //if started, start timer
        if (gameStatus === 'on') {

            //reset variables
            setGameStatus('playing');
            setShapeCount(0);
            setIsWinner(false);
            setTime(0);
            setDraggableShapesArray(shuffleArray(JSON.parse(JSON.stringify(placeholderShapesArrayStart))));
            setPlaceholderShapesArray(shuffleArray(JSON.parse(JSON.stringify(draggableShapesArrayStart))));
            
            //set start time
            const timeNow = new Date().getTime();
            setStartTime(timeNow);

            //set timeout
            setTimeout(() => {
                //show modal with result
                setIsGameOver(true);
            }, timeout * 1000);

        } else if (gameStatus === 'off') {
            //clear timer
            const highestTimeoutId = setInterval(() => { ";" });
            for (let i = 0; i < highestTimeoutId; i++) {
                clearInterval(i);
            }
            
            //stop timer animation (turn off shape drag functionality and show start arrow)
            setStartTime(0); 
        }

    }, [gameStatus])

    //GAME OVER: trigger reset useeffect on game over
    useEffect(() => {
        
        if (isGameOver) {

            //triger reset useEffect
            setGameStatus("off");

            //set original arrays to move pieces back to tray
            setDraggableShapesArray(shuffleArray(JSON.parse(JSON.stringify(placeholderShapesArrayStart))));
            setPlaceholderShapesArray(shuffleArray(JSON.parse(JSON.stringify(draggableShapesArrayStart))));
            
        }

    }, [isGameOver])


//||||||||||| DRAG + DROP HANDLERS |||||||||||

    //store dragged item on drag
    const handleDragStart = (item) => {
        draggingItem = item;
    };

    //store placeholder item on drag over
    const handleDragOver = (event, item) => {
        event.preventDefault() //prevent default (does not allow dropping an element in another)
        dragOverItem = item;
    }

    //if dropped item is a match for drop placeholder, update placeholder and draggable arrays
    const handleDrop = (item) => {

        //check if last two digits in identifiers match
        if (draggingItem.id === dragOverItem.id) {

            //set dropped to true (dropped shape is added to placeholder)
            const placeholderShapesArrayCopy = [...placeholderShapesArray];
            for (let i = 0; i < placeholderShapesArrayCopy.length; i++) {
                const shape = placeholderShapesArrayCopy[i];
                if (shape === item) {
                    shape.shapeDropped = true;
                    break;
                }
            }
            setPlaceholderShapesArray(placeholderShapesArrayCopy);

            //set moved to true (an empty div will be added in it's place)
            const draggableShapesArrayCopy = [...draggableShapesArray];
            for (let i = 0; i < draggableShapesArrayCopy.length; i++) {
                const shape = draggableShapesArrayCopy[i];
                if (shape.id === draggingItem.id) {
                    shape.shapeMoved = true;
                    break;
                }
            }
            setDraggableShapesArray(draggableShapesArrayCopy);

            //increment shape count + check if won
            const count = shapeCount + 1;
            setShapeCount(count);

            if (count === winningCount) {
                //calculate time difference since start
                const timeDifference = Math.round(Math.abs((new Date().getTime() - startTime) / 1000));
                
                //values below passed to leaderboard/modal component to dicate message
                setTime(timeDifference) 
                setIsWinner(true); 
                
                //trigger modal to be shown
                setIsGameOver(true);
            }
        }
    };


//||||||||||| DOM |||||||||||

    return (
        <>
        {/* game section */}
        <section className="top-container wrapper">
            <div className="game">
                <div className="outer-game">
                    <header>
                        <h1>PERFECTION</h1>
                        <div className="timer">
                            {/* add start animation on timer on game start */}
                            <img src={ outerTimerImg } alt="outside of timer with painted ticks for each second" />
                            <img src={ innerTimerImg } className={ startTime ? "start" : null } alt="inside of timer with ticking animation on game start" />
                        </div>
                        <div className="nav-container">
                            <button onClick={ () => setGameStatus('on') }>Start</button>
                            { //hide start arrow when playing
                                startTime
                                    ? null
                                    : <><ShapeComponent name="Arrow" /><ShapeComponent name="ArrowMobile" /></>

                            }
                            <nav>
                                <ul>
                                    <li><a href="#instructions">INSTRUCTIONS</a></li>
                                    <li><a href="#leader-board">LEADERBOARD</a></li>
                                </ul>
                            </nav>
                        </div>
                    </header>
                    
                    {/* placeholder shapes */}
                    <div className="drop-elements">
                        {
                            //loop through placeholder shapes array, render on page
                            placeholderShapesArray.map((item) => (
                                <div key={ "drop_" + item.id }>
                                    {
                                        //add dropped shape, if dropped
                                        item.shapeDropped
                                            ? <div className="drop-container dropped" 
                                                onDragOver={ (event) => handleDragOver(event, item) }
                                                onDrop={ () => handleDrop(item) } >

                                                    <div className="dropped" >
                                                        {/* "fly class with animation dded on game over" */}
                                                        <div className={ isGameOver ? "drag-container fly" : "drag-container" }>
                                                                <ShapeComponent name={ item.shape } className="drag dropped" />
                                                                <ShapeComponent name="Handle" />
                                                        </div>
                                                    </div>
                                                
                                                </div>

                                            : <div className="drop-container" 
                                                onDragOver={ (event) => handleDragOver(event, item) } 
                                                onDrop={ () => handleDrop(item) } >

                                                <ShapeComponent name={ item.shape } className="drop" />

                                            </div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* draggable shapes */}
            <div className="drag-tray">
                <div className="drag-elements">
                    {
                        //loop through draggable shapes array, render on page
                        draggableShapesArray.map((item) => (

                            //add shape, if not yet moved, else leave empty div to avoid shapes moving
                            !item.shapeMoved

                                ? <div key={ "drag_" + item.id }>
                                    {/* set item as draggable if game started, add fly class on game over */}
                                    <div className={ isGameOver ? "drag-container fly" : "drag-container" } 
                                        draggable={ startTime ? true : false } 
                                        onDragStart={ () => handleDragStart(item) } 
                                        key={ "drag_" + item.id } 
                                        aria-label={ item.shape + " piece" }>

                                        <ShapeComponent name={ item.shape } styleApplied={{ rotate: '0deg' }} />
                                        <ShapeComponent name="Handle" />

                                    </div>
                                </div>
                                : <div key={ "empty_" + item.id }></div>
                        ))
                    }
                </div>
            </div>
        </section>

        {/* leaderboard, databse call + modal */}
        <LeaderBoard 
            isWinner={ isWinner } 
            time={ time } 
            isGameOver={ isGameOver } 
            setIsGameOverFn={ setIsGameOver } />

        </>
    );
};
