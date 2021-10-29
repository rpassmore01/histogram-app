import './App.css';
import React from 'react';
import Jimp from 'jimp';
import * as d3 from "d3";

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
    this.drawChart = this.drawChart.bind(this)
  }
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    }, () => {this.updateValue();})
  }
  drawChart() {
    let min = d3.min(this.state.redValues);
    let max = d3.max(this.state.redValues);
    let domain = [min, max];

    var margin = { top: 30, right: 30, bottom: 30, left: 50 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
    
    let Nbin = 255;

    var x = d3
      .scaleLinear()
      .domain(domain)
      .range([0, width]);
    
    var histogram = d3
      .histogram()
      .domain(x.domain())
      .thresholds(x.ticks(Nbin));
    
    var bins = histogram(this.state.redValues);

    var svg = d3
      .select(".svg-div")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
    var y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        0,
        d3.max(bins, function(d) {
          return d.length;
        })
      ]);

    svg.append("g").call(d3.axisLeft(y));
    
    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function(d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function(d) {
        return height - y(d.length);
      })
      .style("fill", "red");
    
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
      this.drawChart();
    })
  }
  
  render() {
    return (
      <div>
        <input type="file" onChange={this.handleChange} />
        <div className="photo-graph-div">
          <div className="img-div">
            <img src={this.state.file} />
          </div>

          <div className="svg-div"></div>

        </div> 
      </div>
    );
  }
}

export default Upload;
