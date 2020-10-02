const recipeContainer = document.getElementById('recipe-container');

    function myRecipe(title, servings, ingredients) {
      this.myTitle = title;   // string
      this.myServings = servings;   // number
      this.myIngredients = ingredients;   // array

      this.print = () => {
        const displayTitle = document.createElement('div');
        displayTitle.setAttribute("style", "font-weight: 600");
        const titleTxt = document.createTextNode(this.myTitle); 
        displayTitle.appendChild(titleTxt);

        const displayServings = document.createElement('div');
        const servingsTxt = document.createTextNode("Serves: " + this.myServings);
        displayServings.appendChild(servingsTxt);

        const ingred = document.createElement('div');
        const ingredTxt = document.createTextNode("Ingredients: ");
        ingred.appendChild(ingredTxt);

        const ingredientList = document.createElement('ul');
        this.myIngredients.forEach(function(ingredient) {
          const node = document.createElement('li');
          let txt = document.createTextNode(ingredient);
          node.appendChild(txt);
          ingredientList.appendChild(node); 
        });
      
        recipeContainer.append(displayTitle, displayServings, ingred, ingredientList);
      }
    }

    const stew = new myRecipe("Goulash", 10, ["potato", "beef", "carrot", "bayleaf"]);
    stew.print();