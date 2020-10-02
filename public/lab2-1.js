const btnContainer = document.getElementById('button-container');

    const generateButtons = (numButtons) => {
      if (numButtons === 0) {
        const noButtonMessage = document.createTextNode("Generated 0 buttons.");
        btnContainer.appendChild(noButtonMessage);
      } else {
        for (let i = 0; i < numButtons; i++) {
          const btn = document.createElement("button");

          let label = String.fromCharCode(i+65);
          let btnText = document.createTextNode(label);
          
          btn.setAttribute("style", "margin: 5px")
          btn.onclick = () => console.log("Button " + label + " was clicked!");
          btn.appendChild(btnText)
        
          btnContainer.appendChild(btn);
        } 
      }
    }

    let numberButtons = 0;

    do {
      const input = window.prompt("How many buttons would you like? (1-26)");
      numberButtons = parseInt(input, 10); 
    } while (numberButtons > 26);
    
    generateButtons(numberButtons);