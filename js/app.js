$(function() {
	var minesweeper = Object.create(Minesweeper);
	
	$("#play").on("click", play);
	$("#apply-difficult").on("click", play);
	
	$("#easy-difficult").on("click", function() {
		setDifficult(9, 9, 10);
	});
	
	$("#medium-difficult").on("click", function() {
		setDifficult(16, 16, 40);
	});
	
	$("#hard-difficult").on("click", function() {
		setDifficult(30, 16, 99);
	});
	
	play();
	
	
	function setDifficult(width, height, nbMines) {
		$("#cells-width").val(width);
		$("#cells-height").val(height);
		$("#nb-mines").val(nbMines);
	}
	
	function play() {
		var width = parseInt($("#cells-width").val());
		var height = parseInt($("#cells-height").val());
		var nbMines = parseInt($("#nb-mines").val());
		
		var difficultParam = Object.create(DifficultParam);
		difficultParam.init(width, height, nbMines);
		
		minesweeper.resetGame();
		minesweeper.initGame(difficultParam);
	}
});