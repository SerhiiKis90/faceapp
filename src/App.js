import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import SignIn from './components/SignIn/SignIn'
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
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
      imageURL:'',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box : box});
  }

  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }

  onSubmit = ()=> {
    this.setState({imageURL: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err)) 
    }

  onRouteChange = (route) => {
    if(route==='signout') {
      this.setState({isSignedIn: false})
    } else if(route==='home'){
      this.setState({isSignedIn:true})
    }

    
    this.setState({route: route});
  }  
    
  render() {
  return (
        <div className="App">
      <Particles className="particles"
      params={particlesOptions}
      />
     <Navigation isSignedIn={this.state.isSignedIn} onRouteChange = {this.onRouteChange} />
     { this.state.route==='home' ? 
         <div>
          <Logo />
          <Rank />
          <ImageLinkForm
             onInputChange={this.onInputChange}
             onSubmit = {this.onSubmit}
           />
         <FaceRecognition box = {this.state.box} imageURL={this.state.imageURL} />
        </div>
        : (
          this.state.route === 'signin' 
          ? <SignIn onRouteChange={this.onRouteChange} />
          :<Register onRouteChange={this.onRouteChange} />
        )
     }
    </div>
);
  }
}

export default App;
