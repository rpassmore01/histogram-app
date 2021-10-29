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
      greenValues: [],
      imgCounter: 1
    }
    this.handleChange = this.handleChange.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.drawChart = this.drawChart.bind(this)
  }
  handleChange(event) {

    if(event.target.files[0] != null){
      this.setState({
        file: URL.createObjectURL(event.target.files[0])
      }, () => {this.updateValue();})
    }
  }
  drawChart() {
    let min = d3.min(this.state.redValues);
    let max = d3.max(this.state.redValues);
    let domain = [min, max];

    var margin = { top: 30, right: 30, bottom: 30, left: 50 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg = d3.select(".svg-div")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
      .domain(domain)
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
    var histogram = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(255));
    
    var redBins = histogram(this.state.redValues);
    var blueBins = histogram(this.state.blueValues);
    var greenBins = histogram(this.state.greenValues);
    
    var y = d3.scaleLinear()
      .range([height, 0])
      .domain([
        0,
        d3.max(blueBins, function(d) {
          return d.length;
        })
      ]);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(redBins)
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
      .style("fill", "red")
      .style("opacity", "0.6");
      
    svg
      .selectAll("rect2")
      .data(greenBins)
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
      .style("fill", "green")
      .style("opacity", "0.6");;

    svg
      .selectAll("rect3")
      .data(blueBins)
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
      .style("fill", "blue")
      .style("opacity", "0.6");

    
//draws axis titles
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height)
      .text("Pixel Value 0-255");

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Pixel Count");

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .attr("y", 0 - (margin.top/ 2))
      .attr("x", (width / 2))
      .text("Graph " + this.state.imgCounter);
      
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
        <h1>Histogram Web App</h1>
        <p>Upload a photo to see a histogram for the image, or upload multiple to compare histograms.</p>
        <input type="file" onChange={this.handleChange} />
        <div className="photo-graph-div">
          <div className="img-div">
            {this.state.file == null ? <p>No Image Uploaded</p> :  <img src={this.state.file} />}
          </div>

          <div className="svg-div"></div>

        </div> 
      </div>
    );
  }
}

export default Upload;
