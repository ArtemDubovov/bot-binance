import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { http } from './consts/consts';

const SAVE_CURRANCY = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'DOGEUSDT', 'USDTRUB'];

function App() {

  const [balance, setBalance] = useState([]);
  const [requstCurrency, setRequstCurrency] = useState(0);
  const [allCurrancy, setAllCurrancy] = useState([]);
  const [valueFavoriteCurrancy, setValueFavoriteCurrancy] = useState('');
  const [favoriteCurrancy, setFavoriteCurrancy] = useState(localStorage.getItem('favoriteCurrancy') ? localStorage.getItem('favoriteCurrancy').split(',') : SAVE_CURRANCY);

  const updateBalance = async () => {
    const id = setInterval(async () => {
      try {
        const req = await axios(http);
        setRequstCurrency(req.data);
      } catch (e) {
        clearInterval(id);
        console.log(`Ошибка, сообщите разработчику - ${e}`);
      }
    }, 1000);
  }

  const getBalance = async () => {
    return axios(`${http}/balance`);
  }

  useEffect(() => {

    getBalance()
    .then(res => {
      const list = [];

      for (let curr in res.data) {
        list.push({[curr]: res.data[curr]});
      }
      setBalance(list);
      list.map(el => {
      });
    });

    updateBalance();

    getAllCurrancy()
    .then(res => {
      const list = [];

      for (let curr in res.data) {
        list.push({[curr]: res.data[curr]});
      }
      setAllCurrancy(list);
    });
  }, []);

  const getAllCurrancy = async () => {
    return await axios(http);
  }

  const updateFavCurr = (e) => {
    e.preventDefault();
    if (!requstCurrency) {
      alert('No data!');
      return;
    } else if (!requstCurrency.hasOwnProperty(valueFavoriteCurrancy.toUpperCase())) {
      alert('Wrong currency!');
      return;
    } else if (SAVE_CURRANCY.includes(valueFavoriteCurrancy.toUpperCase())) {
      alert('This currency is already added!');
      return;
    }
    const array = [...favoriteCurrancy];
    array.push(valueFavoriteCurrancy.toUpperCase());
    setFavoriteCurrancy(() => array);

    localStorage.setItem('favoriteCurrancy', array);

    setValueFavoriteCurrancy('');
  }

  const deleteFavCurr = (curr) => {
    const array = [...favoriteCurrancy].filter((el) => el !== curr);
    setFavoriteCurrancy(() => array);
    localStorage.setItem('favoriteCurrancy', array);
  }


  return (
    <div className="App">
      <div className='block-info'>
        <section className='section-info'>
          <h3>FAVOURITE CURRENCY</h3>
          <form className='customForm'>
            <input className='customInput' value={valueFavoriteCurrancy} onChange={(e) => setValueFavoriteCurrancy(e.target.value)} placeholder='Add favorite currancy'/>
            <button className='customButton' onClick={updateFavCurr}>Add currancy</button>
          </form>
          <ul className='list'>
            {favoriteCurrancy.map(curr => 
              <li key={curr}>{curr} - {requstCurrency[curr]}{!SAVE_CURRANCY.includes(curr) && <button className='btn-delete' onClick={() => deleteFavCurr(curr)}>Delete</button>}</li>
            )}
          </ul>
        </section>
        <section  className='section-info'>
          <h3>BALANCE</h3>
          <ul className='list'>
            {balance.map(el => 
              (Math.ceil(+el[Object.keys(el)[0]].available) !== 0 && Math.ceil(+el[Object.keys(el)[0]].onOrder) !== 0) && <li key={Object.keys(el)[0]}>{[Object.keys(el)[0]]} - {el[Object.keys(el)[0]].available} - {el[Object.keys(el)[0]].onOrder}</li>  
            )}
          </ul>
        </section>
      </div>
      
      
      {/* <select>
        {allCurrancy.data.map(el =>
          <option>el</option>  
        )}
      </select> */}

    </div>
  );
}

export default App;
