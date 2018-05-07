import React from 'react';
import './App.css';
import personService from './services/persons'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      showAll: true,
      search: '',
      notification: ''
    }
    this.removePerson
  }

  handleClick() {
    window.confirm("Are you sure?")
  }

  componentWillMount() {
    personService
      .getAll()
      .then(response => {
        this.setState({persons: response.data})
      })
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
    const newPersonObject = {name: this.state.newName, number: this.state.newNumber}
    const personObject = this.getPersonObject(newPersonObject.name)

    {/* Update an existing person */}
    if(!this.checkIfNewPerson(newPersonObject.name)) {
      if(window.confirm(newPersonObject.name + ' on jo luettelossa, korvataanko vanha numero uudella?')) {
        personService
        .update(personObject.id, newPersonObject)
        .then(response => {
          this.setState({
            newPerson: '',
            newNumber: '',
            notification: newPersonObject.name + ' Muutettiin onnistuneesti'
          })
        })
        this.replacePersonNumber(personObject, newPersonObject.number)
        setTimeout(() => {
          this.setState({notification: ''})
        }, 3000)
    }

    {/* Adding a new person */}
    }else {
    personService
      .create(newPersonObject)
      .then(response => {
        this.setState({
          persons: this.state.persons.concat(response.data),
          newPerson: '',
          newNumber: '',
          notification: newPersonObject.name + ' Lisättiin onnistuneesti'
        })
        this.replacePersonNumber(personObject, newPersonObject.number)
        setTimeout(() => {
          this.setState({notification: ''})
        }, 3000)
      })
    }
  }

  deletePerson = (person) => {
        for(var i = 0; i<this.state.persons.length; i++) {
          if(this.state.persons[i].name == person.name) {
            this.state.persons.splice(i, 1)
          }
        }
   }
  
  handlePersonChange = (event) => {
      this.setState({ newName: event.target.value})
  }

  getPersonObject = (name) => {
    for(var i = 0; i<this.state.persons.length; i++) {
      if(this.state.persons[i].name === name) {
        return this.state.persons[i]
        break;
      }
    }
    return false
  }

  Notification = (message, name) => {
    <div className="notification">
    </div>
  }

  replacePersonNumber = (person, newNumber) => {
    for(var i=0; i<this.state.persons.length; i++) {
      if(this.state.persons[i].id == person.id) {
        this.state.persons[i].number = newNumber
        }
      }
  }

  handleNumberChange = (event) => {
    this.setState({ newNumber: event.target.value})
  }

  handleSearch = (event) => {
    this.setState({search: event.target.value})
    this.setState({showAll: false})
  }

  removePerson = (person) => {
    const personid = person.id
    console.log(personid)    
  }

  render() {
    const personsToShow =
        this.state.showAll?
        this.state.persons :
        this.state.persons.filter(person => person.name.toLocaleUpperCase().includes(this.state.search.toLocaleUpperCase()))

    const personList = personsToShow.map(function(person) {
      return <li key={person.id}> 
                <span className="personName">{person.name} </span> 
                <span className="personNumber"> {person.number} </span> 
                <button 
                  onClick={() =>{if (window.confirm('Poistetaanko ' + person.name)) {
                                    personService
                                      .remove(person.id, person)
                                      .then(response => {})
                                    }
                                }
                          }>
                  poista
                </button>
             </li>
    })

    const NotificationBox = ({ message}) => {
      if (message == '') {
        return null
      }
        return (
          <div className="notification">
            {message}
          </div>
        )
    }

    return (
      <div id="content">
        <NotificationBox message={this.state.notification}/>
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