var app = document.getElementById("app");

// Chart building
const createSVG = (width, height) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttribute("height", height);
    svg.setAttribute('width', width);
    svg.setAttribute("class", "svg");
    return svg;
}

const createScale = (chart) => {
  const newScale = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  newScale.setAttribute(
    "x",
    50
  );
  newScale.setAttribute("y", 0);
  newScale.setAttribute("height", chart.height.baseVal.value);
  newScale.setAttribute("width", 5);
  chart.appendChild(newScale);
  const newMin = document.createElementNS("http://www.w3.org/2000/svg", "text");
  newMin.setAttribute(
    "y",
    chart.height.baseVal.value
  );
  newMin.setAttribute(
    "x",
    0
  );
  newMin.append("0");
  chart.appendChild(newMin);
  const newMid = document.createElementNS("http://www.w3.org/2000/svg", "text");
  newMid.setAttribute(
    "y",
    chart.height.baseVal.value - chart.height.baseVal.value/2.2
  );
  newMid.setAttribute("x",
    0
  );
  newMid.append(Math.ceil(Math.max(...Object.values(dict))/2));
  chart.appendChild(newMid);
  const newMax = document.createElementNS("http://www.w3.org/2000/svg", "text");
  newMax.setAttribute("y", chart.width.baseVal.value / 25);
  newMax.setAttribute(
    "x",
    0
  );
  newMax.append(Math.max(...Object.values(dict)));
  chart.appendChild(newMax);
};


const createBarInChart = (x, y, width, height, parent) => {
    const valueTag = document.createElementNS("http://www.w3.org/2000/svg", "text");
    valueTag.setAttribute("x", (x + width/ 2)+50);
    valueTag.setAttribute("y", y - 15);
    valueTag.append(height);
    valueTag.setAttribute("text-anchor", "middle");
    valueTag.setAttribute("class", "barValueLabel");
    parent.appendChild(valueTag);

    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", x + 50);
    bar.setAttribute("y", y + 10);
    bar.setAttribute("rx", 3);
    bar.setAttribute("height", 10000 * height);
    bar.setAttribute("width", width);
    bar.setAttribute("class", "bar");
    parent.appendChild(bar);
}

const generateDataBarsForChart = (chart, dataForChart) => {
    const barWidth =
      (chart.width.baseVal.value * 0.8) / (dataForChart.length * 1.1);
    let currentX = barWidth / 5;
    dataForChart.forEach(([key,value]) => {
      const percentage = (value/(Math.max(...Object.values(dict))));
      const currentY = chart.height.baseVal.value - (455 * percentage) - 10;
      createBarInChart(
        currentX,
        currentY,
        barWidth,
        value,
        chart
      );
      currentX = currentX + barWidth;
    });
  };
/*
const generateDataBarsForChart = (chart, dataForChart) => {
    const barWidth =
      (chart.width.baseVal.value * 0.8) / (dataForChart.length * 1.1);
    let currentX = barWidth / 5;
    dataForChart.forEach(([key,value]) => {
      const currentY = chart.height.baseVal.value - value - 30;
      createBarInChart(
        currentX,
        currentY,
        barWidth,
        value,
        chart
      );
      currentX = currentX + barWidth;
    });
  };
*/
const generateLabelsForChart = (chart, dataForChart) => {
  const labelWidth =
    (chart.width.baseVal.value * 0.8) / (dataForChart.length * 1.1);
  let currentX = labelWidth / 1.5;
  dataForChart.forEach(([key,value]) => {
    const chartHeight = chart.height.baseVal.value;
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    label.setAttribute("x", currentX + 50);
    label.setAttribute("y", chartHeight - 10);
    label.setAttribute("height", 100);
    label.setAttribute("width", labelWidth);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("class", "label");
    label.setAttribute("overflow", "hidden");
    label.append(key.replace(',', ' - '));
    chart.appendChild(label);
    currentX = currentX + labelWidth;
  });
};

const newFullChart = (data, width, height) => {
  const newSVG = createSVG(width, height);
  if(list.length != 0){
    createScale(newSVG);
    generateDataBarsForChart(newSVG, data);
    generateLabelsForChart(newSVG, data);
  }
  app.appendChild(newSVG);
}




let dict = {};
var list = [];
//Functions to generate/update chart to the chart

function updateData(){
    const data = document.getElementById("data").value;
    if(data != ""){
      const intData = newInput(data);
    }
};

function resetData(){
  dict = {};
  list = [];
  const myNode = document.getElementById("app");
  myNode.innerHTML = '';
  generateRandomData();
}

function generateRandomData (){
  while (list.length < 750){
    list.push(Math.floor(Math.random() * 10)  + 1);
  }
  generateBounds();
}

function generateBounds(){
  const numMax = Math.max(...list);
  var numMin = 0;
  if(Math.min(...list) < numMin) numMin = Math.min(...list);
  var d = 5;
  var div = Math.floor(numMax/d)
  while(div > 20 && d < 8){
    d += 1
    div = Math.floor(numMax/d);
  }
  for(let i = div; i < numMax; i+= div){
      if(Object.keys(dict).length == 0){
          dict[[numMin,numMin+i]] = 0
          dict[[numMin+i+1,i+div]] = 0
      }
      else{
          dict[[i+1,i+div]] = 0
      }
  }
  parseData();
}

function parseData(){
  const rangeList = Object.keys(dict)
  for(let i = 0; i < list.length; i++){
      for(let j = 0; j < rangeList.length; j++){
          const bound = rangeList[j].split(',').map(i => Number(i));
          if(bound[0] <= list[i] && list[i]< bound[1]+1){
              dict[[bound[0], bound[1]]] += 1
          }
      }
  }
  // newFullChart(Object.entries(dict), 1000, Math.ceil((getMaximumValue(Object.values(dict)) + 100)/10) * 10);
  newFullChart(Object.entries(dict), 1000, 500);
}

function newInput(input){
  if(input != ''){
    input = input.split(',').map(i => Number(i)).filter(i => !isNaN(i));
    list = input
    dict = {};
    const myNode = document.getElementById("app");
    myNode.innerHTML = '';
    generateBounds();
  }
}

function getMaximumValue(data){
  let maxValue = 0;
  data.forEach((element) => {
    if (element > maxValue) {
      maxValue = element;
    }
  });
  return maxValue;
};

generateRandomData();