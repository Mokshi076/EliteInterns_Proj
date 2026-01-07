const list = document.getElementById("list");

chrome.storage.local.get(null, (data) => {
  for (let site in data) {
    const totalSeconds = Math.floor(data[site] / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const li = document.createElement("li");
    li.textContent = `${site}: ${minutes}m ${seconds}s`;
    list.appendChild(li);
  }
});
document.getElementById("reset").addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    location.reload();
  });
});

