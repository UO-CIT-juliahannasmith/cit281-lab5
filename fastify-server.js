const students = [
  {
    id: 1,
    last: "Last1",
    first: "First1",
  },
  {
    id: 2,
    last: "Last2",
    first: "First2",
  },
  {
    id: 3,
    last: "Last3",
    first: "First3",
  },
];

// Require the Fastify framework and instantiate it
const fastify = require("fastify")();
// Handle GET verb for / route using Fastify
// Note use of "chain" dot notation syntax

//student route
fastify.get("/cit/student", (request, reply) => {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send(students);
});

//student ID route
fastify.get("/cit/student/:id", (request, reply) => {
  // Recieve Request
  // console.log(request);
  let studentIDFromClient = request.params.id;
  //Do something to it
  let studentToGiveToClient = null;

  for (studentFromArray of students) {
    if (studentFromArray.id == studentIDFromClient) {
      studentToGiveToClient = studentFromArray;
      break;
    }
  }

  //Provide a response
  if (studentToGiveToClient != null) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(studentToGiveToClient);
  } else {
    reply
      .code(404)
      .header("Content-Type", "text/html; charset=utf-8")
      .send("Could not find student with given ID");
  }
});

//an unefined/wildcard route
fastify.get("*", (request, reply) => {
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send("<h1>At wildcard route</h1>");
});

fastify.post("/cit/student/add", (request, reply) => {
  //get request from client
  let dataFromClient = JSON.parse(request.body);
  console.log(dataFromClient);
  //do something with request
  //(1) figure out the max id currently in the array 'students'
  let maxID = 0;
  for (individualStudent of students) {
    if (maxID < individualStudent.id) {
      maxID = individualStudent.id;
    }
  }
  //(2) create a new student object of the form:
  // fname = dataFromClient.firstname
  // ...
  // id = maxID + 1
  let generatedStudent = {
    id: maxID + 1,
    last: dataFromClient.lname,
    first: dataFromClient.fname,
  };
  //(3) Add student object in (2) to 'students' array
  students.push(generatedStudent);
  //(4) send the student object created in (2) back to client
  //reply to client
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send(generatedStudent);
});

// Start server and listen to requests using Fastify
const listenIP = "localhost";
const listenPort = 8080;
fastify.listen(listenPort, listenIP, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
