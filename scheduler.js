const fs = require("fs");
const cron = require("node-cron");
const path = require("path");

const jobsFile = path.join(__dirname, "jobs.json");

function loadJobs() {
  try {
    const data = fs.readFileSync(jobsFile, "utf8");
    return JSON.parse(data).jobs;
  } catch (err) {
    console.error("Error loading jobs:", err.message);
    return [];
  }
}

function executeJob(job) {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const dateTime = `Hello World\nDate : ${day}-${month}=${year}\nTime : ${hour}:${minute}:${second}\nid:${job.id}\n*****************\n`;
  fs.appendFileSync("inform.txt", `${dateTime}`);
  console.log(`[${now}] Running job ${job.id}: ${job.name}`);
  console.log(`Hello World from job ${job.id}`);
}

function startScheduler() {
  const jobs = loadJobs();

  if (jobs.length === 0) {
    console.log("No jobs found in jobs.json");
    return;
  }
  jobs.forEach((job) => {
    if (cron.validate(job.schedule)) {
      console.log(`Scheduled job ${job.id}: ${job.name} (${job.schedule})`);

      const task = cron.schedule(job.schedule, () => {
        executeJob(job);
        if (!job.isRecurring) {
          task.stop();
          console.log(`Unscheduled one-time job ${job.id}`);
        }
      });
    } else {
      console.error(`Invalid schedule for job ${job.id}: ${job.schedule}`);
    }
  });
}
startScheduler();
