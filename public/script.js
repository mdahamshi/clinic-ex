document.getElementById("analyzeBtn").onclick = async () => {
  const transcript = document.getElementById("transcript").value;
  const output = document.getElementById("output");

  output.textContent = "Analyzing...";

  const res = await fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript })
  });

  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
};
