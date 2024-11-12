export async function generateInsight(trend, settings) {
  let startTime = new Date().getTime();
  let status;
  let result = {};

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
        synthesis_words: 50,
        model: "gpt-4o-mini",
        temperature: 0.7,
        top_p: 0.9,
        sector: settings.sector,
        occupation: settings.occupation,
        time_frame: settings.timeframe,
      },
    },
  };

  // console.log(JSON.stringify(request_json));
  result.settings = request_json;

  return await fetch(process.env.GATSBY_INSIGHT_GENERATOR_ENDPOINT_v2, {
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
}
