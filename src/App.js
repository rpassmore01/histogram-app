import './App.css';
import React from 'react';
import Jimp from 'jimp';

class Upload extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      file: null,
      redValues: [],
      blueValues: [],
      greenValues: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.updateValue = this.updateValue.bind(this)
  }
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    }, () => {this.updateValue();})
  }
  updateValue() {
    Jimp.read(this.state.file, (err, img) => {
      let localredValues = [];
      let localgreenValues = [];
      let localblueValues = [];
      for (let i = 0; i < img.bitmap.width; i++){
        for (let j = 0; j < img.bitmap.height; j++){
          let hex = img.getPixelColor(i, j);
          let RGBA = Jimp.intToRGBA(hex);
          localredValues.push(RGBA.r)
          localgreenValues.push(RGBA.g)
          localblueValues.push(RGBA.b)
        }
      }
      this.setState({
        redValues: localredValues,
        blueValues: localblueValues,
        greenValues: localgreenValues
      })
    })
  }
  render() {
    return (
      <div>
        <input type="file" onChange={this.handleChange}/>
        <img src={this.state.file} />
      </div>
    );
  }
}

export default Upload;
