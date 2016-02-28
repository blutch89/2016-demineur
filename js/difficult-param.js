var DifficultParam = {
	mineWidth: 9,
	mineHeight: 9,
	nbMines: 10,
	
	init: function(width, height, nbMines) {
		this.mineWidth = width;
		this.mineHeight = height;
		this.nbMines = nbMines;
	},
	
	validateParameters: function(width, height, nbMines) {
		if (!this.isInt(width) || width < 2 || width > 40) {
			return "Le nombre de cellules horizontales est incorrect. Il doit être compris entre 2 et 40.";
		}
		
		if (!this.isInt(height) || height < 2 || height > 20) {
			return "Le nombre de cellules verticales est incorrect. Il doit être compris entre 2 et 20.";
		}
		
		if (!this.isInt(nbMines) || nbMines < 1 || nbMines > width * height - 1) {
			return "Le nombre de mines est incorrect. Il doit être compris entre 1 et " + (width * height - 1) + ".";
		}
		
		return true;
	},
	
	isInt: function (value) {
		var x = parseFloat(value);
		
		return !isNaN(value) && (x | 0) === x;
	}
};