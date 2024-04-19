// used to handle the deletion of old charts when new ones are created
const CANVASES = {};
let delayed;

const FILTERS = [
  "Industry",
  "CountryOfOrigin",
  "Geographics",
  "Generations",
  "Psychographics",
];

const fetchChartDataFromServer = async (chartName, headers = {}) => {
  const nonProcessedData = await fetch(
    `https://brandcoat-charts-api.up.railway.app/api/v1/charts/${chartName}`,
    // `http://localhost:3000/api/v1/charts/${chartName}`,

    {
      headers: headers,
    }
  );
  const processedData = await nonProcessedData.json();

  return processedData;
};

const createSimpleBarChart = (
  canvasID,
  xAxisNames,
  yAxisData,
  chartColors,
  label,
  titleText
) => {
  try {
    CANVASES[canvasID].destroy();
  } catch (error) {}

  CANVASES[canvasID] = new Chart(canvasID, {
    type: "bar",
    data: {
      labels: xAxisNames,
      datasets: [
        {
          label: label,
          backgroundColor: chartColors,
          data: yAxisData,
        },
      ],
    },
    options: {
      responsice: true,
      maintainAspectRatio: false,
      plugins: {
        legend: false,
      },
      title: {
        display: true,
        text: titleText,
        fontSize: 16,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        x: {
          grid: {
            display: false,
          },
        },
      },
      animation: {
        // controls the delay of each point appearing
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          let delaySpeedMultiplier = 200;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
          ) {
            delay =
              context.dataIndex * delaySpeedMultiplier +
              context.datasetIndex * 100;
          }
          return delay;
        },
      },
    },
  });
  // console.log(BARCHART);
};

const createDoughnutChart = (
  canvasID,
  xAxisNames,
  yAxisData,
  label,
  titleText
) => {
  try {
    CANVASES[canvasID].destroy();
  } catch (error) {}

  CANVASES[canvasID] = new Chart(canvasID, {
    type: "doughnut",
    data: {
      labels: xAxisNames,
      datasets: [
        {
          label: label,
          backgroundColor: ["#343541", "#6d7a91 ", "#919bad", "#b8bfcb "],
          data: yAxisData,
          hoverOffset: 7, // controles on hober how much the section will move outside of the chart
          borderWidth: 0, // can be used to remove the gap between donut sections
        },
      ],
    },
    options: {
      responsice: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" },
      },
      title: {
        display: true,
        text: titleText,
        fontSize: 16,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      animation: {
        // controls the delay of each point appearing
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          let delaySpeedMultiplier = 200;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
          ) {
            delay =
              context.dataIndex * delaySpeedMultiplier +
              context.datasetIndex * 100;
          }
          return delay;
        },
      },
    },
  });
};

const createLineChart = (
  canvasID,
  xAxisNames,
  yAxisData,
  chartColors,
  label,
  titleText
) => {
  const config = {
    type: "line",
    data: {
      labels: xAxisNames,
      datasets: [
        {
          label: label,
          data: yAxisData,
          borderColor: chartColors,
          fill: true,
        },
      ],
      borderColor: chartColors,
    },
    options: {
      responsice: true,
      maintainAspectRatio: false,
      legend: { display: false },
      title: {
        display: true,
        text: titleText,
        fontSize: 16,
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  };

  try {
    CANVASES[canvasID].destroy();
  } catch (error) {}

  CANVASES[canvasID] = new Chart(document.getElementById(canvasID), config);
};
const createMultiLineChart = (canvasID, xAxisNames, datasets, titleText) => {
  // TODO: this should be moved and used in the new datasets prep code which is being moved from the backend
  datasets.forEach((dataset) => {
    dataset.tension = 0.3;
  });

  const config = {
    type: "line",
    data: {
      labels: xAxisNames,
      datasets: datasets,
    },
    options: {
      responsice: true,
      maintainAspectRatio: false,
      // legend: { display: false },
      title: {
        display: true,
        text: titleText,
        fontSize: 16,
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
      },
      animation: {
        // controls the delay of each point appearing
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          let delaySpeedMultiplier = 200;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
          ) {
            delay =
              context.dataIndex * delaySpeedMultiplier +
              context.datasetIndex * 100;
          }
          return delay;
        },
      },
    },
  };

  try {
    CANVASES[canvasID].destroy();
  } catch (error) {}

  CANVASES[canvasID] = new Chart(document.getElementById(canvasID), config);
};

const createRadarChart = (canvasID, labels, dataSets) => {
  dataSets = prepareRadarChartDataSets(dataSets);

  try {
    CANVASES[canvasID].destroy();
  } catch (error) {}

  CANVASES[canvasID] = new Chart(canvasID, {
    type: "radar",
    data: {
      labels: labels,
      datasets: dataSets,
    },
    options: {
      responsice: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: 3,
        },
      },
      scale: {
        ticks: {
          beginAtZero: true,
          // min: 20,
          // max: 100,
          // stepSize: 10,
        },
      },
      animation: {
        // controls the delay of each point appearing
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          let delaySpeedMultiplier = 200;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
          ) {
            delay =
              context.dataIndex * delaySpeedMultiplier +
              context.datasetIndex * 100;
          }
          return delay;
        },
      },
    },
  });
};

const prepareRadarChartDataSets = (dataSets) => {
  let preparedDataSets = [];

  dataSets.forEach((dataSet) => {
    preparedDataSets.push({
      label: dataSet.label,
      data: dataSet.data,
      fill: true,
      backgroundColor: dataSet.dataSetLightColor,
      borderColor: dataSet.dataSetColor,
      pointBackgroundColor: dataSet.dataSetColor,
      pointBorderColor: "#fff", //
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: dataSet.dataSetColor,
    });
  });

  return preparedDataSets;
};

const createPolarAreaChart = (canvasID, labels, dataSets) => {
  const data = {
    labels,
    datasets: dataSets,
  };
  const config = {
    type: "polarArea",
    data: data,
    options: {
      responsice: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          // text: titleText,
        },
        legend: {
          display: true,
        },
      },
      animation: {
        // controls the delay of each point appearing
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          let delaySpeedMultiplier = 200;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
          ) {
            delay =
              context.dataIndex * delaySpeedMultiplier +
              context.datasetIndex * 100;
          }
          return delay;
        },
      },
    },
  };
  try {
    CANVASES[canvasID].destroy();
  } catch (error) {}

  CANVASES[canvasID] = new Chart(document.getElementById(canvasID), config);
};

// End of Chart creationg logic

// Start of displaying each chart logic

const displayBrandsPerIndustryChart = async (queryString = "") => {
  // chartData = await fetchChartDataFromServer(`brandsperindustry`);
  const chartData = await fetchChartDataFromServer(
    `brandsperindustry${queryString}`
  );

  const { industriesNames, amountOfCountedBrands, chartColors } = chartData;

  createSimpleBarChart(
    "brandsPerIndusry",
    industriesNames,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Industry brands"
  );
};

const displayColorUsageChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(`colorusage${queryString}`);

  const { countedColorsNames, countedColorsValues, histogramColors } =
    chartData;

  createSimpleBarChart(
    "colorUsage",
    countedColorsNames,
    countedColorsValues,
    histogramColors,
    "Color analysis",
    `Color analysis `
  );
};

const displayLogoChangeFrequencyChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `logochangefrequency${queryString}`
  );

  const { countedYearsKeys, countedYearsValues, chartColor } = chartData;

  createSimpleBarChart(
    "logoChangeFrequency",
    countedYearsKeys,
    countedYearsValues,
    chartColor,
    "Brands",
    `Rebranding cycles analysis`
  );
};

const displayBrandsPerLogoDesignIndustry = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandsperlogoDesign${queryString}`
  );

  const {
    countedDesignApprouchesKeys,
    countedDesignApprouchesValues,
    chartColor,
  } = chartData;

  createSimpleBarChart(
    "brandsPerLogoDesign",
    countedDesignApprouchesKeys,
    countedDesignApprouchesValues,
    chartColor,
    "Amount of logo type usage",
    `Logo type trend analysis`
  );
};

const displayElementsUsageChartv1 = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `elementsusage${queryString}`
  );

  const { labels, dataSets } = chartData;

  createRadarChart("elementsUsageV1", labels, dataSets);
};

const displayElementsUsageChartv2 = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `elementsusage${queryString}`
  );

  const { labels, dataSets } = chartData;

  createPolarAreaChart("elementsUsageV2", labels, dataSets);
};

const displayBrandsPerYearChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandsperyear${queryString}`
  );

  const { years, countedBrands, chartColors } = chartData;

  createSimpleBarChart(
    "brandsPerYear",
    years,
    countedBrands,
    chartColors,
    "Brands",
    "Yearly brands"
  );
};

const displayLogoTypeUsagePerYearChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `logodesignusageperyear${queryString}`
  );

  const { years, datasets } = chartData;

  createMultiLineChart(
    "logoTypeUsagePerYear",
    years,
    datasets,
    // "Amount of usage",
    "Logo type trend analysis"
  );
};

const displayBrandsPerLogoTypeChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandsperlogotype${queryString}`
  );

  const { logoTypesNames, amountOfCountedBrands, chartColors } = chartData;

  createSimpleBarChart(
    "brandsPerLogoType",
    logoTypesNames,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Industry brands"
  );
};

const displayBrandsPerLogoColorCount = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandsperlogocolorcount${queryString}`
  );

  const { colorCountNames, amountOfCountedBrands, chartColors } = chartData;

  createSimpleBarChart(
    "brandsPerLogoColorCount",
    colorCountNames,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Industry brands"
  );
};

const displayBrandsPerLogoFeature = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandsperlogofeatures${queryString}`
  );

  const { logoFeaturesNames, amountOfCountedBrands, chartColors } = chartData;

  createSimpleBarChart(
    "brandsPerLogoFeature",
    logoFeaturesNames,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Industry brands"
  );
};

const displayWordsPerBrandNameChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `wordsperbrandname${queryString}`
  );

  const { wordsPerBrandNameKeys, amountOfwordsPerBrandName, chartColors } =
    chartData;

  createSimpleBarChart(
    "wordsPerBrandName",
    wordsPerBrandNameKeys,
    amountOfwordsPerBrandName,
    chartColors,
    "Brands",
    "Words per brand name"
  );
};

const displayNameLengthPerBrand = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `namelengthperbrand${queryString}`
  );

  const { NameLengthsKeys, amountOfLengths, chartColors } = chartData;

  createSimpleBarChart(
    "nameLengthPerBrand",
    NameLengthsKeys,
    amountOfLengths,
    chartColors,
    "Brands",
    "Name length Per brand"
  );
};

const displayBrandsPerGeneration = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandspergeneration${queryString}`
  );

  const { GenerationNames, amountOfCountedBrands, chartColors } = chartData;

  createSimpleBarChart(
    "brandsPerGeneration",
    GenerationNames,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Brand per generation"
  );
};

const displayBrandsPerMarketReachChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandspermarketreach${queryString}`
  );

  const { marketReachNames, amountOfCountedBrands, chartColors } = chartData;

  createDoughnutChart(
    "brandspermarketreach",
    marketReachNames,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Brand per Market Reach"
  );
};

const displayBrandsPerMarketScopeChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandspermarketscope${queryString}`
  );

  const { marketScopeNames, amountOfCountedBrands, chartColors } = chartData;

  createDoughnutChart(
    "brandspermarketscope",
    marketScopeNames,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Brand per Market Scope"
  );
};

const displayBrandsPerBrandStageChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandsperbrandstage${queryString}`
  );

  const { brandStagesNames, amountOfCountedBrands, chartColors } = chartData;

  createSimpleBarChart(
    "brandsperbrandstage",
    brandStagesNames,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Brand per Brand Stage"
  );
};

const displayBrandsPerCountryChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandspercountry${queryString}`
  );

  const { countriesNames, amountOfCountedBrands, chartColors } = chartData;

  createDoughnutChart(
    "brandspercountry",
    countriesNames,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Brand per Country"
  );
};

const displayBrandsLifeSpanChart = async (queryString = "") => {
  const chartData = await fetchChartDataFromServer(
    `brandslifespan${queryString}`
  );

  const { lifeSpans, amountOfCountedBrands, chartColors } = chartData;

  createSimpleBarChart(
    "brandslifespan",
    lifeSpans,
    amountOfCountedBrands,
    chartColors,
    "Brands",
    "Brand lifespan"
  );
};

// End of displaying each Chart logic

// start of global filters logic

const getQueryString = () => {
  const filterValues = getAllGlobalFiltersValues();

  let query = "";

  for (const key in filterValues) {
    const value = filterValues[key];
    if (value) {
      if (query.length === 0) {
        query += "?";
      } else {
        query += "&";
      }
      query += `${key}=${value}`;
    }
  }
  const processedQuery = replaceAmbersandWithAnd(query);
  return processedQuery;
};

function getAllGlobalFiltersValues() {
  const filtersValues = {};

  FILTERS.forEach((filterName) => {
    filtersValues[filterName] = getEachGlobalFilterValues(filterName);
  });
  return filtersValues;
}

function getEachGlobalFilterValues(filterName) {
  const checkboxes = getFilterCheckboxes(filterName);

  let selectedValues = "";

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      if (selectedValues.length === 0) {
        selectedValues += checkbox.nextElementSibling.textContent;
      } else {
        selectedValues += "-" + checkbox.nextElementSibling.textContent;
      }
    }
  });
  return selectedValues;
}

function getFilterCheckboxes(filterName) {
  const checkboxes = document.querySelectorAll(
    `#globalFilter_dropdownMenu-${filterName} input[type="checkbox"]`
  );
  return checkboxes;
}

// End of global filters logic

// Start of displaying all charts logic

const displayChartsFunctions = [
  displayBrandsPerIndustryChart,
  displayColorUsageChart,
  displayLogoChangeFrequencyChart,
  displayBrandsPerLogoDesignIndustry,
  displayElementsUsageChartv1,
  displayElementsUsageChartv2,
  displayBrandsPerYearChart,
  displayLogoTypeUsagePerYearChart,
  displayBrandsPerLogoTypeChart,
  displayBrandsPerLogoColorCount,
  displayBrandsPerLogoFeature,
  displayWordsPerBrandNameChart,
  displayNameLengthPerBrand,
  displayBrandsPerGeneration,
  displayBrandsPerMarketReachChart,
  displayBrandsPerMarketScopeChart,
  displayBrandsPerBrandStageChart,
  displayBrandsPerCountryChart,
  displayBrandsLifeSpanChart,
];

const displayAllCharts = () => {
  displayChartsFunctions.forEach((chartFunction) => chartFunction());
};

const applyGlobalFilters = () => {
  const queryString = getQueryString();

  displayChartsFunctions.forEach((chartFunction) => chartFunction(queryString));
  setFiltebrandsPerCityCountedBrandsCitiesCount();
  setFilteredBrandsCountText();
};

// End of displaying all charts logic

// start of extra logic about charts

const getFilteredBrandsCount = async () => {
  const res = await fetch(
    `https://brandcoat-charts-api.up.railway.app/api/v1/brands/filtered-brands/length`
    // `http://localhost:3000/api/v1/brands/filtered-brands/length`
  );

  if (res.status !== 200) {
    // make 200 a num not a string
    console.log(res.status);
    return 0;
  }

  const { matchedBrands } = await res.json();

  return matchedBrands;
};

const setFilteredBrandsCountText = async () => {
  const filteredBrandsCount = await getFilteredBrandsCount();

  const filteredBrandsCountTexts = document.querySelectorAll(
    "#filteredBrandsCountText"
  );

  filteredBrandsCountTexts.forEach((filteredBrandsCountText) => {
    filteredBrandsCountText.textContent = `${filteredBrandsCount}`;
  });
};

const getFilteredBrandsCitiesCount = async () => {
  const res = await fetch(
    `https://brandcoat-charts-api.up.railway.app/api/v1/brands/filtered-brands/cities`
    // `http://localhost:3000/api/v1/brands/filtered-brands/cities`
  );
  if (res.status !== 200) {
    // make 200 a num not a string
    console.log(res.status);
    return 0;
  }

  const brandsPerCityCount = await res.json();

  return brandsPerCityCount;
};

const setFiltebrandsPerCityCountedBrandsCitiesCount = async () => {
  const filteredBrandsCitiesCount = await getFilteredBrandsCitiesCount();
  const filteredBrandsCitiesCountKeys = Object.keys(filteredBrandsCitiesCount);

  // getting brands per cities count
  const hanoiBrandsCount =
    filteredBrandsCitiesCount[filteredBrandsCitiesCountKeys[0]];
  const hoChiMinhCityBrandsCount =
    filteredBrandsCitiesCount[filteredBrandsCitiesCountKeys[1]];
  const daNangBrandsCount =
    filteredBrandsCitiesCount[filteredBrandsCitiesCountKeys[2]];

  // getting elements that will contain the amount
  const HanoiCityBrandsCountTexts = document.querySelectorAll(
    "#hanoicitybrandscounttext"
  );
  const hoChiMinhCityBrandsCountTexts = document.querySelectorAll(
    "#hochiminhcitybrandscounttext"
  );
  const daNangCityBrandsCountTexts = document.querySelectorAll(
    "#danangcitybrandscounttext"
  );

  // settingg the value
  HanoiCityBrandsCountTexts.forEach((HanoiCityBrandsCountText) => {
    HanoiCityBrandsCountText.textContent = `${hanoiBrandsCount}`;
  });
  hoChiMinhCityBrandsCountTexts.forEach((hoChiMinhCityBrandsCountText) => {
    hoChiMinhCityBrandsCountText.textContent = `${hoChiMinhCityBrandsCount}`;
  });
  daNangCityBrandsCountTexts.forEach((daNangCityBrandsCountText) => {
    daNangCityBrandsCountText.textContent = `${daNangBrandsCount}`;
  });
};

// end of extra logic about charts

// Start of utility function

function replaceAmbersandWithAnd(originalString) {
  // const replacesString = originalString.replace(/&/g, "and");
  // return replacesString;
  if (originalString.includes("Cafes & Bistros") !== -1) {
    const editedString = originalString.replace(
      "Cafes & Bistros",
      "Cafes and Bistros"
    );
    return editedString;
  }

  if (originalString.includes("F & B") !== -1) {
    const editedString = originalString.replace("F & B", "F and B");
    return editedString;
  }

  return originalString;
}

// End of utility function

const initPage = () => {
  displayAllCharts();
  setFiltebrandsPerCityCountedBrandsCitiesCount();
  setFilteredBrandsCountText();
};

initPage();
