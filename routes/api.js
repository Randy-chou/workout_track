const router = require("express").Router();
const { Exercise, Workout } = require("../models/index.js");

// Creates a new workout
router.post("/api/workouts", ({ body }, res) => {
    Workout.create(body)
        .then(dbTransaction => {
            res.json(dbTransaction);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

// Creates a new exercise then puts it in a workout
router.put("/api/workouts/:id", (req, res) => {
    Exercise.create(req.body)
        .then(({ _id }) => Workout.findByIdAndUpdate(
            req.params.id,
            { $push: { exercises: _id, durations: req.body.duration} }, { new: true }))
        .then(updated => { res.json(updated) })
        .catch(err => { res.json(err); });
});

// Returns a list of workouts
router.get("/api/workouts", (req, res) => {
  Workout.aggregate([
      {
        $addFields: { 
          totalDuration: { $sum: "$durations" }
        }
      }
    ])
    .sort({ day: 1 })
    .then(workdata => {
      Workout.populate(workdata, {path: 'exercises'} , 
        (err, workdata) => {
          res.json(workdata);
        })
    });
});

// Returns a last 7 workouts
router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    {
      $addFields: { 
        totalDuration: { $sum: "$durations" }
      }
    }
  ])
  .sort({ day: -1 })
  .limit(7)
  .sort({ day: 1 })
  .then(workdata => {
    Workout.populate(workdata, {path: 'exercises'} , 
      (err, workdata) => {
        res.json(workdata);
      })
  });
});


// router.get("/api/workouts", (req, res) => {
//   Workout.find({})
//     .sort({ date: -1 })
//     .populate("exercises")
//     .then(workdata => {
//       res.json(workdata);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });

// router.post("/api/workouts", ({ body }, res) => {
//   Transaction.create(body)
//     .then(dbTransaction => {
//       res.json(dbTransaction);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });

// router.post("/api/workouts", ({ body }, res) => {
//   Transaction.insertMany(body)
//     .then(dbTransaction => {
//       res.json(dbTransaction);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });

// router.get("/api/workouts/range", (req, res) => {
//     Transaction.find({})
//       .sort({ date: -1 })
//       .then(dbTransaction => {
//         res.json(dbTransaction);
//       })
//       .catch(err => {
//         res.status(400).json(err);
//       });
//   });



module.exports = router;
