import './App.css';
import { useEffect, useState } from 'react';
import Card from './components/Card';
import cardImages from './components/cardImages';

function App() {
  const cardAmount = 6;
  //const [cardAmount, setCardAmount] = useState(6);
  const [cards,setCards] = useState([]);
  const [turns,setTurns] = useState(0);
  const [choiceOne,setChoiceOne] = useState(null);
  const [choiceTwo,setChoiceTwo] = useState(null);
  const [cardDisabled,setCardDisabled] = useState(false);

  //Sets up the card deck
  const setupDeck = ()=>{
    //picks N random cards
    const pickedCards = Array.from(cardImages);
    for(let i=pickedCards.length;i>cardAmount;i--){
      let element = Math.random() * pickedCards.length;
      pickedCards.splice(element,1);
    }
    //shuffles selected cards
    const shuffledCards = [...pickedCards,...pickedCards]
    .sort(()=> Math.random() - 0.5)
    .map((card)=>({...card,matched: false,/* ¿? -> */id: Math.random()}))

    //save
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);  
    setTurns(0);
  }

  const handleChoice = (card)=>{
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  }

  //Compares 2 chosen cards value
  useEffect(()=>{
    if(choiceOne && choiceTwo){
      setCardDisabled(true);
      if(choiceOne.src===choiceTwo.src){
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.src === choiceOne.src)
              return {...card, matched:true};
            else
              return card;
          });
        })
        resetCards();
      } else {
        setTimeout(()=>resetCards(),1000);
      }
    }
  },[choiceOne,choiceTwo]);

  
  //Resets choices and increase turn number
  const resetCards=()=>{
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setCardDisabled(false);
  }

  //Start game automatically on load
  useEffect(()=>{
     setupDeck();
  },[])

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={setupDeck}>New Game</button>
      <div className="card-grid">
        {cards.map(card => (
          <Card 
            key={card.id} 
            card={card} 
            handleChoice={handleChoice}
            flipped={
              card === choiceOne ||
              card === choiceTwo ||
              card.matched
            }
            disabled={cardDisabled}
          />
        ))}
      </div>
      <h4>Turns: {turns}</h4>
    </div>
  );
}

export default App;
