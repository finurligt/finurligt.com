import React, { Component } from 'react';
import { Scatter } from 'react-chartjs-2';
import PolynomialRegression from "js-polynomial-regression";

const ORDER = 2;

interface TravianToolChartProps {
  data: PolynomialRegression.DataPoint[];
}

interface TravianToolChartState {
  trendline: PolynomialRegression.DataPoint[];
}

class TravianToolChart extends Component<TravianToolChartProps, TravianToolChartState> {
  constructor(props: TravianToolChartProps) {
    super(props);
    // Initialize your component's state here (if needed)
    this.state = {
      trendline: []
      // Initial state properties
    };
  }

  componentDidUpdate(prevProps: TravianToolChartProps, prevState: TravianToolChartState) {
    // Perform any updates or side-effects based on props or state changes
    if (prevProps !== this.props) {
      console.log(this.props.data)
      this.calculateTrendline(this.props.data, ORDER)
    }
  }
  
  calculateTrendline = (data: PolynomialRegression.DataPoint[], order: number) => {
    const model = PolynomialRegression.read(data, order);
    const terms = model.getTerms();
    
    const xs = data.map((p => p.x))
    const xmax = Math.max(...xs)
    const xmin = Math.min(...xs)
    console.log(xs)

    let datapoints : {x: number, y: number}[] = []
    for (let i = xmin; i <= xmax; i++) {
      datapoints.push({
        x: i,
        y: model.predictY(terms, i)
      })
    }
    
    this.setState({
      trendline: datapoints
    })

  };

  render() {
    const { data } = this.props;

    // Calculate the polynomial regression coefficients (second-order polynomial in this example)

    // Prepare the dataset for the scatter plot
    const scatterData = {
      datasets: [
        {
          label: 'Scatter Plot',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          pointRadius: 6,
          showLine: false, // Do not show a line connecting the points
        },
        {
          label: 'Polynomial Trendline',
          data: this.state.trendline,
          borderColor: 'rgba(75, 192, 192, 0.8)', // Customize the trendline color
          borderWidth: 2, // Customize the trendline width
          pointRadius: 0,
          showLine: true, // Show the trendline
        },
      ],
    };

    // Customize the options for the scatter plot
    const scatterOptions = {
      scales: {
        x: {
          type: 'linear', // Use 'linear' scale for X-axis (numeric values)
          position: 'bottom',
        },
        y: {
          type: 'linear', // Use 'linear' scale for Y-axis (numeric values)
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
    };

    return (
      <div>
        <Scatter data={scatterData} options={scatterOptions} />
      </div>
    );
  }
}

export default TravianToolChart;
