let BARCHART;
let LASTCHARTTOSHOWINDUSTRYFILTERMENU;
let LASTCHARTTOSHOWAGENCYFILTERMENU;

// charts choosing logic
const chartsBtnList = document.querySelector(".charts-btn__list");

chartsBtnList.addEventListener("click", (e) => {
    // ! these function should be only used when needed to make the design smoother
    hideIndustryFiltersMenu();
    hideAgencyFiltersMenu();

    const industryFiltersToggleBtn = document.querySelector(
        ".industry-filters-toggle"
    );
    const agencyFiltersToggleBtn = document.querySelector(
        ".agency-filters-toggle"
    );
    industryFiltersToggleBtn.textContent = "All industries";
    agencyFiltersToggleBtn.textContent = "All agencies";

    chartName = e.target.textContent.trim();
    if (chartName.length > 40) {
        return;
    }
    switch (chartName) {
        case "Industry data range":
            displayPostsPerIndustryChart();
            break;
        case "Yearly data range":
            displayPostsPerYearChart();
            break;
        case "Color analysis":
            displayColorUsageChart();
            break;
        case "Logo type trend analysis":
            displayPostsPerLogoDesignIndustry();
            break;
        case "Trend analysis (minimalist branding)":
            displayLogoDesignUsagePerYearChart();
            break;
        case "Wuxing five elements (vI)":
            displayElementsUsageChartv1();
            break;
        case "Wuxing five elements (v2)":
            displayElementsUsageChartv2();
            break;
        case "Rebranding cycles analysis":
            displayLogoChangeFrequencyChart();
            break;
        case "Agencies focus analysis":
            displayAgenciesPostsPerIndustry();
            break;
    }
});

// filters lists showign and hiding logic
const showIndustryFiltersMenu = (theChartThatShowedInudstryFilterMenu) => {
    LASTCHARTTOSHOWINDUSTRYFILTERMENU = theChartThatShowedInudstryFilterMenu;
    const industryFiltersList = document.querySelector(
        ".industry-filter-menu--wapper"
    );
    industryFiltersList.style.display = "block";
};

const hideIndustryFiltersMenu = () => {
    const industryFiltersList = document.querySelector(
        ".industry-filter-menu--wapper"
    );
    industryFiltersList.style.display = "none";
};

const showAgencyFiltersMenu = (theChartThatShowedAgencyFilterMenu) => {
    LASTCHARTTOSHOWAGENCYFILTERMENU = theChartThatShowedAgencyFilterMenu;

    const agencyFiltersList = document.querySelector(
        ".agency-filter-menu--wapper"
    );
    agencyFiltersList.style.display = "block";
};

const hideAgencyFiltersMenu = () => {
    const agencyFiltersList = document.querySelector(
        ".agency-filter-menu--wapper"
    );
    agencyFiltersList.style.display = "none";
};

// list of filters logic
const industryFiltersToggleBtn = document.querySelector(
    ".industry-filters-toggle"
);
const industryFilters = document.querySelector(".industry-filters");
const industryFilterList = document.querySelector(".industry-filter-list");

industryFiltersToggleBtn.addEventListener("click", () => {
    industryFilters.classList.toggle("show-filters-list");
});

industryFilterList.addEventListener("click", (e) => {
    filter = e.target.textContent;
    if (filter.length > 50) {
        return;
    }
    industryFiltersToggleBtn.textContent = e.target.textContent;
    BARCHART.destroy();
    switch (LASTCHARTTOSHOWINDUSTRYFILTERMENU) {
        case "Color analysis":
            displayColorUsageChart(filter);
            break;
        case "Rebranding cycles analysis":
            displayLogoChangeFrequencyChart(filter);
            break;
        case "Logo type trend analysis":
            displayPostsPerLogoDesignIndustry(filter);
            break;
        case "Wuxing five elements (vI)":
            displayElementsUsageChartv1(filter);
            break;
        case "Wuxing five elements (v2)":
            displayElementsUsageChartv2(filter);
            break;
    }
});

const agencyFiltersToggleBtn = document.querySelector(".agency-filters-toggle");
const agencyFilters = document.querySelector(".agency-filters");
const agencyFilterList = document.querySelector(".agency-filter-list");

agencyFiltersToggleBtn.addEventListener("click", () => {
    agencyFilters.classList.toggle("show-filters-list");
});

agencyFilterList.addEventListener("click", (e) => {
    filter = e.target.textContent;
    if (filter.length > 30) {
        return;
    }
    agencyFiltersToggleBtn.textContent = e.target.textContent;
    BARCHART.destroy();
    if (filter === "M — N Associates") {
        filter = "M N Associates";
    }
    switch (LASTCHARTTOSHOWAGENCYFILTERMENU) {
        case "Agencies focus analysis":
            displayAgenciesPostsPerIndustry(filter);
            break;
    }
});
// ?------------------------------------------
// ?CDN
// ?------------------------------------------

const fetchChartDataFromServer = async (chartName, headers = {}) => {
    // new filtering style
    const queryString = getQueryString();

    const nonProcessedData = await fetch(
        `https://brandcoat-colors-usage-api-production-b18a.up.railway.app/api/charts/${chartName}${queryString}`,
        // `http://localhost:3000/api/charts/${chartName}${queryString}`,

        {
            headers: headers,
        }
    );
    const processedData = await nonProcessedData.json();

    return processedData;
};

const createSimpleBarChart = (
    xAxisNames,
    yAxisData,
    chartColors,
    label,
    titleText
) => {
    BARCHART = new Chart(document.getElementById("bar-chart"), {
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
            // responsice: true,
            // maintainAspectRatio: true,
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
    console.log(BARCHART);
};

const createLineChart = (
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
            legend: { display: false },
            title: {
                display: true,
                text: titleText,
                fontSize: 16,
            },
        },
    };

    BARCHART = new Chart(document.getElementById("bar-chart"), config);
};

const createRadarChart = (labels, dataSets) => {
    dataSets = prepareRadarChartDataSets(dataSets);
    BARCHART = new Chart(document.getElementById("bar-chart"), {
        type: "radar",
        data: {
            labels: labels,
            datasets: dataSets,
        },
        options: {
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

const createPolarAreaChart = (labels, dataSets) => {
    const data = {
        labels,
        datasets: dataSets,
    };
    const config = {
        type: "polarArea",
        data: data,
        options: {
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

    BARCHART = new Chart(document.getElementById("bar-chart"), config);
};

const getQueryString = () => {
    const selectFilters = document.querySelectorAll(
        ".select-filter:not(.exclude)"
    );

    let query = "";
    selectFilters.forEach((selectFilter, index) => {
        if (selectFilter.value !== "Select" && selectFilter.value !== "All") {
            if (query === "") {
                query += "?";
            }
            if (query !== "?" && query[query.length - 1] !== "&") {
                query += "&";
            }
            query += `${selectFilter.name}=${selectFilter.value}`;
        }
    });
    return query;
};

const displayPostsPerIndustryChart = async () => {
    chartData = await fetchChartDataFromServer("postsperindustry");

    const { industriesNames, amountOfCountedPosts, chartColors } = chartData;

    // ? since this is the default chart we need to check first before we destroy because at first there won't be a chart to destroy
    if (BARCHART) {
        BARCHART.destroy();
    } else {
        BARCHART = document.getElementById("bar-chart");
    }

    createSimpleBarChart(
        industriesNames,
        amountOfCountedPosts,
        chartColors,
        "Data Range",
        "Industry data range"
    );
};

const displayColorUsageChart = async (industryFilter = "All industries") => {
    headers = { industryFilter };
    const chartData = await fetchChartDataFromServer("colorusage", headers);

    // console.log(BARCHART.getContext("2d"));

    const {
        countedColorsNames,
        countedColorsValues,
        histogramColors,
        INDUSTRYLISTFORFILTERMENU,
    } = chartData;

    BARCHART.destroy();

    createSimpleBarChart(
        countedColorsNames,
        countedColorsValues,
        histogramColors,
        "Color analysis",
        `Color analysis in ${industryFilter}`
    );

    showIndustryFiltersMenu("Color analysis");
};

const displayLogoChangeFrequencyChart = async (
    industryFilter = "All industries"
) => {
    headers = { industryFilter };

    chartData = await fetchChartDataFromServer("logochangefrequency", headers);

    const { countedYearsKeys, countedYearsValues, chartColor } = chartData;

    BARCHART.destroy();

    createSimpleBarChart(
        countedYearsKeys,
        countedYearsValues,
        chartColor,
        "Brands",
        `Rebranding cycles analysis in ${industryFilter}`
    );
    showIndustryFiltersMenu("Rebranding cycles analysis");
};

const displayAgenciesPostsPerIndustry = async (
    agencyfilter = "All agencies"
) => {
    showAgencyFiltersMenu("Agencies focus analysis");

    const headers = {
        agencyfilter,
    };
    chartData = await fetchChartDataFromServer(
        "agenciespostsperindustry",
        headers
    );

    const { industriesNames, amountOfCountedPosts, chartColors } = chartData;

    BARCHART.destroy();

    createSimpleBarChart(
        industriesNames,
        amountOfCountedPosts,
        chartColors,
        "Amount of projects",
        "Agencies focus analysis"
    );
};

const displayPostsPerLogoDesignIndustry = async (
    industryFilter = "All industries"
) => {
    headers = { industryFilter };

    chartData = await fetchChartDataFromServer("postsperlogoDesign", headers);

    const {
        countedDesignApprouchesKeys,
        countedDesignApprouchesValues,
        chartColor,
    } = chartData;

    BARCHART.destroy();

    createSimpleBarChart(
        countedDesignApprouchesKeys,
        countedDesignApprouchesValues,
        chartColor,
        "Amount of logo type usage",
        `Logo type trend analysis in ${industryFilter}`
    );
    showIndustryFiltersMenu("Logo type trend analysis");
};

const displayElementsUsageChartv1 = async (
    industryFilter = "All industries"
) => {
    headers = { industryFilter };
    const chartData = await fetchChartDataFromServer("elementsusage", headers);

    const { labels, dataSets } = chartData;
    BARCHART.destroy();
    createRadarChart(labels, dataSets);
    showIndustryFiltersMenu("Wuxing five elements (vI)");
};

const displayElementsUsageChartv2 = async (
    industryFilter = "All industries"
) => {
    headers = { industryFilter };
    const chartData = await fetchChartDataFromServer("elementsusage", headers);

    const { labels, dataSets } = chartData;
    BARCHART.destroy();
    createPolarAreaChart(labels, dataSets);
    showIndustryFiltersMenu("Wuxing five elements (v2)");
};

const displayPostsPerYearChart = async () => {
    chartData = await fetchChartDataFromServer("postsperyear");

    const { years, countedPosts, chartColors } = chartData;

    BARCHART.destroy();

    createSimpleBarChart(
        years,
        countedPosts,
        chartColors,
        "Data range",
        "Yearly data range"
    );
};

const displayLogoDesignUsagePerYearChart = async () => {
    // headers to be added once we make the chart dynamic accros multiple logo designs

    chartData = await fetchChartDataFromServer("logodesignusageperyear");

    const { years, designApprouchUsage, chartColors } = chartData;

    BARCHART.destroy();

    createLineChart(
        years,
        designApprouchUsage,
        chartColors,
        "Amount of usage",
        "Trend analysis (minimalist branding)"
    );
};

displayPostsPerIndustryChart("All industries");

// New

// under dev

// dynamicly created the filter list
// const createIndustryFilterList = (indusryeslist) => {
//     industryFilterList.innerHTML = "";
//     indusryeslist.forEach((industry) => {
//         const li = document.createElement("li");
//         const button = document.createElement("button");
//         button.textContent = industry;
//         button.classList.add("btn");
//         li.appendChild(button);
//         industryFilterList.appendChild(li);
//     });
// };
