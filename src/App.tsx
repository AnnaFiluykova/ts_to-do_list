import React, { ChangeEvent, FormEvent, useState } from 'react';
import './App.css';

let i = 0;

interface List {
  [key: string]: {
    name: string;
    state: string;
  }
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState<List>({});
  const [filter, setFilter] = useState('all');

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  const onButtonClick = (key: string) => {
    setList((prev) => {
      delete prev[key];
      return {...prev};
    });
  }

  const onDeleteCompleted = () => {
    setList((prev) => {
      const newList = {...prev};
      Object.entries(list).forEach(([key, value]) => {
        if (value.state === 'completed') {
          delete newList[key];
        }
      })
      return {...newList};
    })
  }

  const onCheckboxChange = (key: string, checked: boolean) => {
    setList((prev) => ({ ...prev, [key]: { ...prev[key], state: checked ? 'completed' : 'active' } }));
  }

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue !== '') {
      const newKey = String(i++);
      setList((prev) => ({ ...prev, [newKey]: { name: inputValue, state: 'active' } }));
      setInputValue('');
    }
  }

  return (
    <div className="app">
      <div className='app__inscription'>TODOS</div>
      <form onSubmit={onFormSubmit} className='app__form'>
        <input onChange={onInputChange} value={inputValue} className='app__form-input' />
        <button type='submit' className='app__form-button'>new task</button>
      </form>
      <div className='app__list'>
        {Object.keys(list)
          .filter((key) => {
            if (filter === 'all') {
              return true;
            } else if (filter === 'completed') {
              return list[key].state === 'completed';
            } else if (filter === 'active') {
              return list[key].state === 'active';
            }
          })
          .map((key) => {
            const item = list[key];
            return (
              // <form key={`list-${key}`} className={item.state === 'completed'? 'app__list-completed' : 'app__list-active'}>
              <div key={`list-${key}`} className='app__list-item'>
                <label className={`app__list-item-label ${item.state === 'completed'? 'app__list-completed' : 'app__list-active'}`}>
                  <input
                    type="checkbox"
                    className='app__list-checkbox'
                    onChange={(e) => onCheckboxChange(key, e.target.checked)}
                    defaultChecked={item.state === 'completed'}
                  />
                  {item?.name}
                </label>
                <button className='app__list-button' onClick={() => onButtonClick(key)}>x</button>
              </div>
            )
          })
        }
      </div>
      <div className='app__buttons'>
        <div className='app__buttons-sort'>
          <button onClick={() => setFilter('all')} className='app__buttons-btn'>All</button>
          <button onClick={() => setFilter('active')} className='app__buttons-btn'>Active</button>
          <button onClick={() => setFilter('completed')} className='app__buttons-btn'>Completed</button>
        </div>
        <div className='app__buttons-delete'>
          <button onClick={onDeleteCompleted} className='app__buttons-btn'>Clear completed</button>
        </div>
      </div>
    </div>
  );
}

export default App;
