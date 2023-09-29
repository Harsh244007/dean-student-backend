const Session = require("../models/Session");
const User = require("../models/User");

let currentDate = new Date();

exports.getAvailableSessions = async (req, res) => {
  try {
    var freeSessions = await Session.find({ status: "Pending" });
    freeSessions= freeSessions.filter((e) => {
      let date = e.date.split("/").reverse().join("-");
      let time = e.time;
      let newDate = new Date(`${date}T${time}:00Z`);
      if (newDate.getTime() > currentDate.getTime()) {
        return e;
      }
    });

    return res.json({freeSessions});
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.getDeanPendingSessions = async (req, res) => {
  try {
    var bookedDeanSessions = await Session.find({
      dean: req.params.deanId,
      students: { $ne: req.params.deanId },
      status: "Booked",
    });
    bookedDeanSessions= bookedDeanSessions.filter((e) => {
      let date = e.date.split("/").reverse().join("-");
      let time = e.time;
      let newDate = new Date(`${date}T${time}:00Z`);
      if (newDate.getTime() > currentDate.getTime()) {
        return e;
      }
    });
    res.json({ bookedDeanSessions });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.bookSession = async (req, res) => {
  try {
    let sessionId = req.params.sessionId;

    const session = await Session.findById(sessionId);
    if (!session || !session.dean || session.status == "Booked") {
      return res
        .status(400)
        .json({ message: "Session not available for booking." });
    }

    session.status = "Booked";

    const dean = await User.findById(session.dean);
    if (!dean) {
      return res.status(404).json({ message: "Dean not found." });
    }
    dean.bookedSessions.push(sessionId);
    await dean.save();

    const student = await User.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    student.bookedSessions.push(sessionId);
    await student.save();

    session.students = student._id;

    await session.save();

    return res.json({ message: "Session booked successfully." });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.createSession = async (req, res) => {
  try {
    const { date, time, dean, selectAll, students } = req.body;
    if (!date || !time) {
      return res
        .status(400)
        .json({ message: "Date, time are required fields." });
    }
    if (!selectAll && !students) {
      return res.status(400).json({ message: "Please select students." });
    }

    if (req.user.role !== "dean") {
      return res
        .status(403)
        .json({ message: "Only deans can create sessions." });
    }

    const session = new Session({
      date,
      time,
      dean,
      students: students,
      status: "Booked",
    });

    await session.save();

    await User.updateMany(
      { _id: { $in: students } },
      { $push: { studentSessions: session._id } }
    );

    await User.findByIdAndUpdate(
      { _id: dean },
      { $push: { deanSessions: session._id } }
    );

    return res.json({ message: "Session created successfully." });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
