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
            { $push: { exercises: _id } }, { new: true }))
        .then(updated => { res.json(updated) })
        .catch(err => { res.json(err); });
});

// Returns a list of workouts
router.get("/api/workouts", (req, res) => {
  Workout.aggregate([
      {
        $addFields: { 
          totalDuration: "$exercises"
        }
      }
    ])
    .then(workdata => {
      Workout.populate(workdata, {path: 'exercises'} , 
        (err, workdata) => {
          console.log(workdata);
          console.log(workdata[0].exercises);
          res.json(workdata);
        })
    });
});


// router.get("/api/workouts", (req, res) => {
//   Workout.find({})
//     .sort({ date: -1 })
//     .populate("exercises")
//     .aggregate([
//       {
//         $addFields: { 
//           totalDuration: { $sum: "$exercises.duration" } 
//         }
//       }
//     ])
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
