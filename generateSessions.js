const Session = require("./models/Session");
const connection = require("./database/db");

async function generateClasses(date, deanId) {
  try {
    await connection();
    const startTime = "10:00";

    const sessions = [];
    let startTimeSeprated = Number(startTime.split(":")[0]);
    for (let start = 0; start < 9; start++) {
      if (start == 4) continue;
      const session = new Session({
        date: date,
        students:deanId,
        time: startTimeSeprated + start + ":00",
        status: "Pending",
        dean: deanId,
      });

      sessions.push(session);
    }

    let dateTimeSeprated = startTime.split("/");
    let newDate = Number(dateTimeSeprated[0]);
    for (let start = 0; start < 9; start++) {
      if (start == 4) continue;
      const session = new Session({
        date:
          newDate + 1 + "/" + dateTimeSeprated[1] + "/" + dateTimeSeprated[2],
        time: startTimeSeprated + start + ":00",
        status: "Pending",
        students:deanId,
        dean: deanId,
      });
      sessions.push(session);
    }

    await Session.insertMany(sessions);
    console.log(
      `Generated ${sessions.length} sessions for ${date} with dean ID ${deanId}`
    );
    return
  } catch (error) {
    console.error("Error generating sessions:", error);
  }
}

generateClasses("10/12/2023", "651721ea97393bdf287e11e1");
