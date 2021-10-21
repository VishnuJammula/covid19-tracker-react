import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};


const getWorldWideStats = (data, casesType) =>{
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
  
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
}

const getCountryWideStats = (data, casesType)=>{
  let chartData = [];
  let lastDataPoint;
  for (let date in data.timeline.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
          x: date,
          y: data['timeline'][casesType][date] - lastDataPoint,
        };
  
      chartData.push(newDataPoint);
    }
    lastDataPoint = data['timeline'][casesType][date];
  }
  return chartData;
}

const buildChartData = (data, casesType, countryCode) => {
 
  if(countryCode === 'worldwide'){
    return getWorldWideStats(data, casesType)
  }
  else{
    return getCountryWideStats(data,casesType)
  }
};


function LineGraph({countryCode,casesType }) {


  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
        :  `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=120`

      console.log(url)

      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType, countryCode);
          setData(chartData);
          console.log(chartData);
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType,countryCode]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          height={470}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
