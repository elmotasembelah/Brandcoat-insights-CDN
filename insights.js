// used to handle the deletion of old charts when new ones are created
const CANVASES = {};

const FILTERS = [
    "Industry",
    "Geographics",
    "Generations",
    "Psychographics",
    "Matrix",
];

const fetchChartDataFromServer = async (chartName, headers = {}) => {
    const nonProcessedData = await fetch(
        `https://brandcoat-charts-api.up.railway.app/api/charts/${chartName}`,
        // `http://localhost:3000/api/charts/${chartName}`,

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
            legend: { display: false },
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
        },
    });
    // console.log(BARCHART);
};

const createLineChart = (
    canvasID,
    xAxisNames,
    yAxisData,
    chartColors,
    label,
    titleText
) => {
    config = {
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
        },
    };

    try {
        CANVASES[canvasID].destroy();
    } catch (error) {}

    CANVASES[canvasID] = new Chart(document.getElementById(canvasID), config);
};
const createMultiLineChart = (canvasID, xAxisNames, datasets, titleText) => {
    config = {
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
        },
    };
    try {
        CANVASES[canvasID].destroy();
    } catch (error) {}

    CANVASES[canvasID] = new Chart(document.getElementById(canvasID), config);
};

// End of Chart creationg logic

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
                selectedValues += checkbox.value;
            } else {
                selectedValues += "-" + checkbox.value;
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

// Start of displaying each chart logic

const displayBrandsPerIndustryChart = async (queryString = "") => {
    // chartData = await fetchChartDataFromServer(`brandsperindustry`);
    chartData = await fetchChartDataFromServer(
        `brandsperindustry${queryString}`
    );

    const { industriesNames, amountOfCountedBrands, chartColors } = chartData;

    createSimpleBarChart(
        "brandsPerIndusry",
        industriesNames,
        amountOfCountedBrands,
        chartColors,
        "Data Range",
        "Industry data range"
    );
};

const displayColorUsageChart = async (queryString = "") => {
    chartData = await fetchChartDataFromServer(`colorusage${queryString}`);

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
    chartData = await fetchChartDataFromServer(
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
    chartData = await fetchChartDataFromServer(
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
    chartData = await fetchChartDataFromServer(`elementsusage${queryString}`);

    const { labels, dataSets } = chartData;

    createRadarChart("elementsUsageV1", labels, dataSets);
};

const displayElementsUsageChartv2 = async (queryString = "") => {
    chartData = await fetchChartDataFromServer(`elementsusage${queryString}`);

    const { labels, dataSets } = chartData;

    createPolarAreaChart("elementsUsageV2", labels, dataSets);
};

const displayBrandsPerYearChart = async (queryString = "") => {
    chartData = await fetchChartDataFromServer(`brandsperyear${queryString}`);

    const { years, countedBrands, chartColors } = chartData;

    createSimpleBarChart(
        "brandsPerYear",
        years,
        countedBrands,
        chartColors,
        "Data range",
        "Yearly data range"
    );
};

const displayLogoTypeUsagePerYearChart = async (queryString = "") => {
    chartData = await fetchChartDataFromServer(
        `logodesignusageperyear${queryString}`
    );

    const { years, datasets } = chartData;

    createMultiLineChart(
        "logoTypeUsagePerYear",
        years,
        datasets,
        // "Amount of usage",
        "Trend analysis (minimalist branding)"
    );
};

const displayBrandsPerLogoTypeChart = async (queryString = "") => {
    chartData = await fetchChartDataFromServer(
        `brandsperlogotype${queryString}`
    );

    const { logoTypesNames, amountOfCountedBrands, chartColors } = chartData;

    createSimpleBarChart(
        "brandsPerLogoType",
        logoTypesNames,
        amountOfCountedBrands,
        chartColors,
        "Data Range",
        "Industry data range"
    );
};

const displayBrandsPerLogoColorCount = async (queryString = "") => {
    chartData = await fetchChartDataFromServer(
        `brandsperlogocolorcount${queryString}`
    );

    const { colorCountNames, amountOfCountedBrands, chartColors } = chartData;

    createSimpleBarChart(
        "brandsPerLogoColorCount",
        colorCountNames,
        amountOfCountedBrands,
        chartColors,
        "Data Range",
        "Industry data range"
    );
};

const displayBrandsPerLogoFeature = async (queryString = "") => {
    chartData = await fetchChartDataFromServer(
        `brandsperlogofeatures${queryString}`
    );

    const { logoFeaturesNames, amountOfCountedBrands, chartColors } = chartData;

    createSimpleBarChart(
        "brandsPerLogoFeature",
        logoFeaturesNames,
        amountOfCountedBrands,
        chartColors,
        "Data Range",
        "Industry data range"
    );
};

// End of displaying each Chart logic

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
];

const displayAllCharts = () => {
    displayChartsFunctions.forEach((chartFunction) => chartFunction());
};

const applyGlobalFilters = () => {
    const queryString = getQueryString();

    displayChartsFunctions.forEach((chartFunction) =>
        chartFunction(queryString)
    );
};

displayAllCharts();

// End of displaying all charts logic

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
    return originalString;
}

// End of utility function

// https://cdn.jsdelivr.net/gh/elmotasembelah/Brandcoat-insights-CDN/new-insights.js
