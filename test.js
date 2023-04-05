const totalTime = endDate.getTime() - startDate.getTime();
const elapsedTime = currentDate.getTime() - startDate.getTime();
const percentage = Math.round((elapsedTime / totalTime) * 100);

const barLength = 20; // Adjust the length of the progress bar
const progressBar =
  "█".repeat(Math.round((barLength * percentage) / 100)) +
  "░".repeat(barLength - Math.round((barLength * percentage) / 100));
