import React from 'react';
import './App.css';
import axios from 'axios';
import personService from './services/persons'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [
                { name: 'Keijo',
                  number: '040-42131321'
                },
                { name: 'Janne',
                  number: '050-42131321'
                },
                { name: 'Niilo',
                  number: '020-312532'
                }
                ],
      newName: '',
      newNumber: '',
      showAll: true,
      search: ''
    }
  }

  componentWillMount() {
    personService
      .getAll()
      .then(response => {
        this.setState({persons: response.data})
      })

    // axios
    //   .get('http://localhost:3001/persons')
    //   .then(response => {
    //     console.log('promise fulfilled')
    //     this.setState({ persons: response.data })
    //   })
  }
  

  checkIfNewPerson = (name) => {
    for(var i = 0; i<this.state.persons.length; i++) {
      if(this.state.persons[i].name === name) {
        return false;
        break;
      }
    }
    return true;
  }

  addPerson = (event) => {
    event.preventDefault()

    const personObject = {name: this.state.newName, number: this.state.newNumber}

    personService
      .create(personObject)
      .then(response => {
        this.setState({
          persons: this.state.persons.concat(response.data),
          newPerson: ''
        })
        this.setState({newNumber: ''})
      })

    // MYÖS VANHA:
    // axios.post('http://localhost:3001/persons', personObject)
    //   .then(response => {
    //     this.setState({
    //       persons: this.state.persons.concat(response.data),
    //       newName: ''
    //     })
    //     this.setState({newNumber: ''})
    //   })

    /* VANHA TAPA TEHDÄ (ei tuu bäkistä):
    if(this.checkIfNewPerson(this.state.newName)) {
      const persons = this.state.persons.concat(personObject)
      this.setState({persons, newName: ''})
      this.setState({newNumber: ''})
      }*/
    }
  
  handlePersonChange = (event) => {
      this.setState({ newName: event.target.value})
  }

  handleNumberChange = (event) => {
    this.setState({ newNumber: event.target.value})
  }

  handleSearch = (event) => {
    this.setState({search: event.target.value})
    this.setState({showAll: false})
  }

  render() {
    const personsToShow =
        this.state.showAll?
        this.state.persons :
        this.state.persons.filter(person => person.name.toLocaleUpperCase().includes(this.state.search.toLocaleUpperCase()))

    const personList = personsToShow.map(function(person) {
      return <li key={person.name}> 
                <span className="personName">{person.name} </span> 
                <span className="personNumber"> {person.number} </span> 
                <button onClick="Window.confirm()"> poista </button>
             </li>
    })

    return (
      <div id="content">
        <h2>Puhelinluettelo</h2>
        <div>
          rajaa näytettäviä
          <input
            name="search"
            value={this.state.search}
            onChange={this.handleSearch}
          />
        </div>

        <h3> Lisää uusi </h3>
        <form onSubmit={this.addPerson}>
          <div>
            nimi: 
            <input 
                name="nimi: "
                value={this.state.newName} 
                onChange={this.handlePersonChange}
            />
            </div>
            <div>
              numero: 
              <input
                name="numero: "
                value={this.state.newNumber}
                onChange={this.handleNumberChange}
              />
            </div>
            <button type="submit">lisää</button>
        </form>
        <h3>Numerot</h3>
        <div>
          <ul>
            {personList}
          </ul>
        </div>
      </div>
    )
  }
}

export default App