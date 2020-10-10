async function fetchResponse() {
    console.log("button clicked!");
    const data = document.getElementById("name").value;

    const response = await fetch(`/serverTime/?name=${data}`)
    const result = await response.text();
    document.getElementById("responseBox").innerHTML = result;
}