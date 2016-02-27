var Minesweeper = {
	mineSize: 35,
	normalBackground: "blue",
	clickedBackground: "none",
	flagState: "drapeau.png",
	mineState: "mine.png",
	cellTextColor: "red",
	cellTextSize: "15px",
	timerInterval: undefined,
	
	// Lance une partie
	initGame: function(difficultParam) {
		this.difficultParam = difficultParam;
		
		var thiss = this;
		var container = $("#container");
		var gameContainer = $("#game-container");
		
		// CSS containers
		gameContainer.css("width", (thiss.mineSize * thiss.difficultParam.mineWidth + 2) + "px");
		container.css("width", parseInt(gameContainer.css("width")) + 60 + "px");
		
		// Création de toutes les cellules
		for (i = 0; i < this.difficultParam.mineHeight; i++) {
			for (ii = 0; ii < this.difficultParam.mineWidth; ii++) {
				gameContainer.append("<div class='cell'></div>");
			}
			
			gameContainer.append("<div class='clearfix'></div>");
		}
		
		// Application du CSS, des évènements et des tags aux cellules
		var i = 0;
		var cells = $(".cell");
		var mines = this.getMinesTab();
		
		cells.each(function() {
			var x = i % thiss.difficultParam.mineWidth;
			var y = Math.floor(i / thiss.difficultParam.mineWidth);
			
			// CSS
			$(this).css("width", thiss.mineSize);
			$(this).css("height", thiss.mineSize);
			$(this).css("background-color", thiss.normalBackground);
			$(this).css("color", thiss.cellTextColor);
			$(this).css("font-size", thiss.cellTextSize);
			$(this).css("line-height", thiss.mineSize + "px");
			$(this).css("border", "1px solid black");
			$(this).css("border-radius", "4px");
			$(this).animate({opacity: 1}, 1000);
			
			// Evènements
			$(this).on("click", null, {thiss: thiss}, thiss.clickOnCell);
			$(this).on("contextmenu", null, {thiss: thiss}, thiss.rightClickOnCell);
			
			// Tags
			if ($.inArray(i, mines) > -1) {	// Si la cellule est une mine
				$.data(this, "datas", {isMine: true, isFlag: false, isClicked: false, x: x, y: y});
			} else {						// Si la cellule est une cellule normale
				$.data(this, "datas", {isMine: false, isFlag: false, isClicked: false, x: x, y: y});
			}
			
			i++;
		});
		
		// Démarrage timer
		this.timerInterval = setInterval(thiss.setGameTime, 1000);
	},
	
	// Retourne un array de x numéro de cellules représentant des mines
	getMinesTab: function() {
		var mines = new Array();
		
		for (i = 0; i < this.difficultParam.nbMines; i++) {
			do {
				var randomNb = Math.floor(Math.random() * this.difficultParam.mineHeight * this.difficultParam.mineWidth);
				mines[i] = randomNb;
			} while ($.inArray(randomNb, mines) == -1);
		}
		
		return mines;
	},
	
	// Ajoute une seconde au timer
	setGameTime: function() {
		var gameTime = $("#game-time");
		var currentTime = parseInt(gameTime.text());
		gameTime.text(++currentTime);
	},
	
	// Reset le jeu
	resetGame: function() {
		$("#game-container").html("");
		
		$("#game-result").text("");
		
		$("#game-time").text("0");
		clearInterval(this.timerInterval);
		
		$("#game-nb-flags").text("0");
	},
	
	// Retourne une cellule (cells représente toutes les cellules pour éviter de trop charger en performance)
	getCell: function(x, y, cells) {
		var toReturn = undefined;
		
		cells.each(function() {
			if ($.data(this, "datas").x == x && $.data(this, "datas").y == y) {
				toReturn = this;
				return false;
			}
		});
		
		return toReturn;
	},

	// Click gauche sur une cellule
	clickOnCell: function(e) {
		var thiss = e.data.thiss;
		
		if (e.which == 1) {
			if ($.data(this, "datas").isMine && !$.data(this, "datas").isFlag) {	// Si c'est une mine et que la cellule n'a pas de drapeau
				$(this).css("background-image", "url(images/" + thiss.mineState + ")");
				thiss.lost();
			} else {																// Si c'est une cellule normale
				thiss.propagation(this);
				thiss.checkIfWon();
			}
		}
	},
	
	// Click droit sur une cellule
	rightClickOnCell: function(e) {
		e.preventDefault();
		var thiss = e.data.thiss;
		var flags = $("#game-nb-flags");
		
		if ($.data(this, "datas").isClicked == false) {
			if ($.data(this, "datas").isFlag == false) {
				$.data(this, "datas").isFlag = true;
				$(this).css("background-image", "url(images/" + thiss.flagState + ")");
				flags.text(parseInt(flags.text()) + 1);
			} else {
				$.data(this, "datas").isFlag = false;
				$(this).css("background-image", "none");
				flags.text(parseInt(flags.text()) - 1);
			}
		}
	},
	
	// Méthode servant à dévoiler les cellules lors d'un click sur l'unes d'entre elles
	propagation: function(cell) {
		// Quitte la fonction si la cell est en dehors du tableau ou a déjà été cliquée
		if (cell == undefined || $.data(cell, "datas").isClicked == true) {
			return;
		}
		
		var x = $.data(cell, "datas").x;
		var y = $.data(cell, "datas").y;
		var cells = $(".cell");		// Définition de cette variable pour ne pas avoir à charger ces cellules à chaque fois -> gain de performance
		var nbMinesAround = this.countNbMines(cell, cells);
		
		// Marque la cellule comme cliquée
		$.data(cell, "datas").isClicked = true;
		$(cell).animate({backgroundColor: "transparent"}, 200, "linear");
		
		if (nbMinesAround == 0) {			// Si aucune mine, relance la propagation
			this.propagation(this.getCell(x, y - 1, cells));
			this.propagation(this.getCell(x + 1, y - 1, cells));
			this.propagation(this.getCell(x + 1, y, cells));
			this.propagation(this.getCell(x + 1, y + 1, cells));
			this.propagation(this.getCell(x, y + 1, cells));
			this.propagation(this.getCell(x - 1, y + 1, cells));
			this.propagation(this.getCell(x - 1, y, cells));
			this.propagation(this.getCell(x - 1, y - 1, cells));
		} else {							// Si au moins une mine, note le nombre sur la cellule
			$(cell).text(nbMinesAround);
		}
	},
	
	// Compte le nombre de mines aux alentours de la cellule en paramètre
	countNbMines: function(cell, cells) {
		var x = $.data(cell, "datas").x;
		var y = $.data(cell, "datas").y;
		var nbMinesAround = 0;
		
		nbMinesAround += this.isCellMined(this.getCell(x, y - 1, cells));
		nbMinesAround += this.isCellMined(this.getCell(x + 1, y - 1, cells));
		nbMinesAround += this.isCellMined(this.getCell(x + 1, y, cells));
		nbMinesAround += this.isCellMined(this.getCell(x + 1, y + 1, cells));
		nbMinesAround += this.isCellMined(this.getCell(x, y + 1, cells));
		nbMinesAround += this.isCellMined(this.getCell(x - 1, y + 1, cells));
		nbMinesAround += this.isCellMined(this.getCell(x - 1, y, cells));
		nbMinesAround += this.isCellMined(this.getCell(x - 1, y - 1, cells));
		
		return nbMinesAround;
	},
	
	// Est-ce que la cellule en paramtre est minée ?
	isCellMined: function(cell) {
		var isMined = false;
		
		if (cell != undefined && $.data(cell, "datas").isClicked == false) {
			if ($.data(cell, "datas").isMine) {
				isMined = true;
			}
		}
		
		return isMined ? 1 : 0;
	},
	
	// Test si la partie est gagnée. Si oui, applique la victoire
	checkIfWon: function() {
		var nbUnclicked = 0;
		
		$(".cell").each(function() {
			if ($.data(this, "datas").isClicked == false) {
				nbUnclicked++;
			}
		});
		
		if (nbUnclicked == this.difficultParam.nbMines) {
			$("#game-result").text("Vous avez gagné !");
			this.lockGameContainer();
		}
	},
	
	// Applique la défaite
	lost: function() {
		$("#game-result").text("Vous avez perdu !");
		this.lockGameContainer();
	},
	
	// Bloque le jeu
	lockGameContainer: function() {
		var cells = $(".cell");
		cells.off("click");
		cells.off("contextmenu");
		
		clearInterval(this.timerInterval);
	}
};