import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import 'tachyons';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '4a075e4e3ea243c0b8c73c4e36da1a4f'
});


const particlesOptions = {
  interactivity: {
    detectsOn: "canvas",
    events: {
      onClick: {
        enable: true,
        mode: "push"
      },
      onHover: {
        enable: false,
        mode: "repulse"
      },
      resize: true
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
        speed: 1
      },
      push: {
        quantity: 4
      },
      repulse: {
        distance: 200,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: "#ffffff"
    },
    
    collisions: {
      enable: true
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 3,
      straight: false
    },
    number: {
      density: {
        enable: true,
        value_area: 800
      },
      value: 80
    },
    opacity: {
      value: 0.5
    },
    shape: {
      type: "circle"
    },
    size: {
      random: true,
      value: 5
    }
  }

}

class App extends Component {
  constructor() {
    super()
    this.state ={
      input: '',
      imageURL:''
    }
  }

  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }

  onSubmit = ()=> {
    this.setState({imageURL: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
    function(response) {
      console.log(response);
    },
    function(err) {
      // there was an error
    }
  );
  }
  render() {
  return (
    <div className="App">
      <Particles className="particles"
      params={particlesOptions}
      />
     <Navigation />
     <Logo />
     <Rank />
     <ImageLinkForm
     onInputChange={this.onInputChange}
     onSubmit = {this.onSubmit}
     />
    <FaceRecognition imageURL={this.state.imageURL} />
    </div>
  );
  }
}

export default App;
