const Interview = require("../models/Interview");

exports.getInterviews = async (req, res) => {
  const interviews = await Interview.find({})
    .populate("participants", "name")
    .exec();
  res.render("interviews", { interviews });
};

exports.createInterview = async (req, res) => {
  const { participants, startTime, endTime } = req.body;
  if (participants.length < 2) {
    return res
      .status(400)
      .json({ message: "At least 2 participants are required" });
  }
  const conflictingInterview = await Interview.findOne({
    participants: { $in: participants },
    $or: [
      {
        startTime: { $lte: new Date(startTime) },
        endTime: { $gte: new Date(startTime) },
      },
      {
        startTime: { $lte: new Date(endTime) },
        endTime: { $gte: new Date(endTime) },
      },
    ],
  });
  if (conflictingInterview) {
    return res
      .status(400)
      .json({
        message:
          "One or more participants are not available during the scheduled time",
      });
  }
  const interview = new Interview({
    participants,
    startTime,
    endTime,
  });
  await interview.save();
  res.redirect("/interviews");
};

exports.editInterview = async (req, res) => {
  const { participants, startTime, endTime } = req.body;
  if (participants.length < 2) {
    return res
      .status(400)
      .json({ message: "At least 2 participants are required" });
  }
  const conflictingInterview = await Interview.findOne({
    _id: { $ne: req.params.id },
    participants: { $in: participants },
    $or: [
      {
        startTime: { $lte: new Date(startTime) },
        endTime: { $gte: new Date(startTime) },
      },
      {
        startTime: { $lte: new Date(endTime) },
        endTime: { $gte: new Date(endTime) },
      },
    ],
  });
  if (conflictingInterview) {
    return res
      .status(400)
      .json({
        message:
          "One or more participants are not available during the scheduled time",
      });
  }
  const interview = await Interview.findByIdAndUpdate(req.params.id, {
    participants,
    startTime,
    endTime,
  });
  res.redirect("/interviews");
};
