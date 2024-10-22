export async function generateInsight(trend, settings) {
  let startTime = new Date().getTime();
  let status;
  let result = {};

  const request_json_sample = {
    body: {
      trend: {
        title: "Multilateral smart city initiatives",
        summary: "From municipal to global.",
        description:
          "The smart cities movement got going in 2007-8 as the priorities of national governments and global capital shifted. Multinationals pulled back spending on IT, while governments ramped up stimulus programs. Big vendors shifted gears to the public sector, and cities offered a prime opportunity. But multilateral institutions were slow to see this emerging issue. Only now—after a decade of false starts, failures, and surprising shifts in the evolution of smart city innovation, markets, and regulation—are real efforts to coordinate internationally gathering pace. What's more, they're tackling the most difficult dilemmas around ethics and equity, where the deployment of smart city technology over the last decade has mostly made things worse. Are multilateral institutions capable of leading the way, or are they merely responding to efforts by cities to reset the urban tech agenda (much as they did on climate change) by building their own global peer networks? All of this points towards a rich global dialogue on both the technology and policy frameworks we favor for building better smart cities, as well as a higher-level discourse on what the objectives of smart cities are in the first place.",
        certainty: "likely",
        impact: "sustaining",
      },
      generator_settings: {
        insights_per_trend: 3,
        insight_words: 50,
        model: "gpt-4o-mini",
        temperature: 0.7,
        top_p: 0.9,
        sector: "Transportation",
        occupation: "Urban Planner",
        time_frame: "2029",
      },
    },
  };

  const request_json = {
    body: {
      trend: {
        title: trend.Name, // "Multilateral smart city initiatives",
        summary: trend.Summary, // "From municipal to global."
        description: trend.Description?.childMarkdownRemark?.rawMarkdownBody, //  "The smart cities movement got going in 2007-8 as the priorities of national governments and global capital shifted..."
        certainty: trend.Certainty, // "likely"
        impact: trend.Impact, // "sustaining"
      },
      generator_settings: {
        insights_per_trend: 3,
        insight_words: 50,
        model: "gpt-4o-mini",
        temperature: 0.7,
        top_p: 0.9,
        sector: settings.sector,
        occupation: settings.occupation,
        time_frame: settings.timeframe,
      },
    },
  };

  console.log(JSON.stringify(request_json));
  result.settings = request_json;

  return await fetch(process.env.GATSBY_INSIGHT_GENERATOR_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(request_json),
  })
    .then((response) => {
      // 1. check response.ok
      // console.log(response.status, response.statusText);
      let status = response.status;
      result.time = new Date().getTime() - startTime + "ms";
      result.timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, "/")
        .replace("T", " ");

      if (response.status !== 200) {
        result.status = "error";
        return result;
      } else {
        let status = response.status;
        result.status = "ok";
        return response.json();
      }
    })
    .then(function (data) {
      // console.log(data);
      // result.timestamp = Date.now();
      result.insights = data.insights;

      return result;
    })
    .catch((error) => {
      result.status = "error";
      // console.error("Error:", error); // e.g. Error: TypeError: Failed to fetch
      return result;
    });
  // .then((json) => {
  //   // all good, token is ready
  //   console.log(json);
  // })
  // .catch((error) => {
  //   console.log(error);
  // });

  // .then(function (response) {
  //   return response.json();
  // })
  // // .then((res) => res.json())
  // // .then((data) => cb(data))
  // // .then(function (data) {
  // //   console.log(data);
  // //   title = document.getElementById("title");
  // //   body = document.getElementById("bd");
  // //   title.innerHTML = data.title;
  // //   body.innerHTML = data.body;
  // // })
  // .catch((error) => console.error("Error:", error));

  // return request;
}
